import Link from "next/link";

import connectToDB from "db";
import UserModel from "@/models/User";
import PrivateModel from "@/models/Private";

import { authUser, getChatInfos, getInboxes } from "u/serverHelpers";
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
	
	const userChatRooms = await getChatInfos();
	const userInboxes = await getInboxes();
	
	
	return (
		<>
			<div
				className="w-full custom-height flex justify-center px-4 pt-4 pb-[10px]"
			>
				<Contacts
					userId={JSON.parse(JSON.stringify(user?._id))}
					isForDialog={false}
				/>
				
				<ChatInterface
					userChatRooms={JSON.parse(JSON.stringify(userChatRooms))}
					userInboxes={JSON.parse(JSON.stringify(userInboxes))}
					userId={JSON.parse(JSON.stringify(user?._id))}
				/>
				
			</div>
			
			<ul className="flex justify-center">
				
				<li className="md--lg:hidden mr-3">
					<ContactsDialog
						userId={JSON.parse(JSON.stringify(user?._id))}
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
