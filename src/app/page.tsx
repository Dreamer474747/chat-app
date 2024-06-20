import Link from "next/link";

import connectToDB from "db";
import UserModel from "@/models/User";
import PrivateModel from "@/models/Private";

import { authUser, getInbox } from "u/serverHelpers";
import { redirect } from "next/navigation";

import { Contacts, ChatInterface, Search, Create, ContactsDialog } from "t/index";
import { Button } from "ui/Button";

import type { GroupType, PrivateType } from "u/types";


export default async function Home() {
	
	connectToDB();
	
	// authUser only returns _id of the user.
	const user = await authUser();
	if (!user) {
		redirect("/login-register");
	}
	
	const allInboxes = await getInbox();
	
	let privateInboxes = [];
	if (allInboxes) {
		
		for (let i = 0; i < allInboxes.privates.length; i++) {
			
			const privateChat = await PrivateModel.findOne({ _id: allInboxes.privates[i] })
			.populate("chatmates", "name").lean();
			
			privateInboxes.push(privateChat)
		}
	}
	/* add "console.log(allInboxes)" and "console.log(privateInboxes)" to understand the code better.
	it will definitely explain whats happening here much better then me. but basically the 
	'allInboxes.privates[i].chatmates' contains only the _id of each chat partner,
	and if we want to get the name of each chat partner from those private inboxes, we have
	to populate them seperatly and store them in the "privateInboxes" constant. */
	
	const sortedInboxes = [...allInboxes?.groups as GroupType[] | [], ...privateInboxes].sort((a: any, b: any) => {
		return new Date(b.lastMessageDate).toISOString().localeCompare(new Date(a.lastMessageDate).toISOString())
	})
	
	
	return (
		<>
			<div
				className="w-full custom-height flex justify-center px-4 pt-4 pb-[10px]"
			>
				<Contacts
					sortedInboxes={JSON.parse(JSON.stringify(sortedInboxes))}
					userId={JSON.parse(JSON.stringify(user._id))}
					isForDialog={false}
				/>
				
				<ChatInterface
					userId={JSON.parse(JSON.stringify(user._id))}
				/>
				
			</div>
			
			<ul className="flex justify-center">
				
				<li className="md--lg:hidden mr-3">
					<ContactsDialog
						sortedInboxes={JSON.parse(JSON.stringify(sortedInboxes))}
						userId={JSON.parse(JSON.stringify(user._id))}
					/>
				</li>
				
				<li className="mr-3">
					<Search />
				</li>
				
				<li>
					<Create />
				</li>
				
			</ul>
		</>
	);
}
