import connectToDB from "@/configs/db";
import UserModel from "@/models/User";
import PrivateModel from "@/models/Private";
import GroupInboxModel from "@/models/GroupInbox";
import PrivateInboxModel from "@/models/PrivateInbox";

import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";


/*
"authUser" is only for authenticating user.
"getChatInfos" is for getting all the contacts and groups of the user.
"getInboxes" is for getting the inboxes of all of the group and private chats of the user.
an inbox is either look like this: { group: string(objectId), lastSeenMessage: string(objectId) }
or like this: { private: string(objectId), lastSeenMessage: string(objectId) }
*/ 


const authUser = async () => {
	
	try {
		const token = cookies().get("token");
		
		let user = null;
		if (token) {
			
			connectToDB();
			const tokenPayload = verifyAccessToken(token.value);
			
			if (tokenPayload) {
				return user = await UserModel.findOne(
				{ email: tokenPayload.email }, "_id")
				.lean();
				// why do i get only the _id? better performance. imagine getting the whole
				// user data every time you try to authenticate user. we just trying to know
				// if the access token of user is valid or not.
			}
		}
		return user;
		
	} catch (err) {
		console.log("auth user error:", err)
	}
}


const getChatInfos = async () => {
	
	connectToDB();
	const user = await authUser();
	
	
	const allGroupInboxes = await GroupInboxModel.find(
		{ user: user._id }, "group"
	)
	.populate("group", "-__v -updatedAt")
	.lean();
	
	const groups = []; // an array of all the group chats of the user
	if (allGroupInboxes.length > 0) {
		
		for (let i = 0; i < allGroupInboxes.length; i++) {
			groups.push(allGroupInboxes[i].group)
		}
	}
	
	
	const allPrivateInboxes = await PrivateInboxModel.find({ user: user._id }, "private")
	
	const privates = []; // an array of all the private chats of the user
	if (allPrivateInboxes.length > 0) {
		
		for (let i = 0; i < allPrivateInboxes.length; i++) {
			
			const privateChat = await PrivateModel.findOne({ _id: allPrivateInboxes[i].private })
			.populate("chatmates", "name").lean();
			
			if (privateChat) {
				privates.push(privateChat)
			}
		}
	}
	/* add "console.log(allPrivateInboxes)" and "console.log(privates)" to
	understand the code better. it will definitely explain whats happening here much
	better then me. but basically the 'allPrivateInboxes[i].chatmates' contains
	only the _id of each chat partner, and if we want to get the name of each chat partner
	from those private inboxes, we have to populate them seperatly and store them in the
	"privates" constant. */
	
	const allChats = [...groups, ...privates]
	
	if (allChats.length > 1) {
		const allChatInfos = allChats.sort((a, b) => {
			return new Date(b.lastMessageDate).toISOString().localeCompare(new Date(a.lastMessageDate).toISOString())
		})
		
		return allChatInfos;
	} else {
		return allChats;
	}
}


const getInboxes = async () => {
	
	connectToDB();
	const user = await authUser();
	
	
	const allGroupInboxes = await GroupInboxModel.find(
		{ user: user._id }, "group lastSeenMessage -_id"
	)
	const allPrivateInboxes = await PrivateInboxModel.find(
		{ user: user._id }, "private lastSeenMessage -_id"
	)
	
	const allInboxes = [...allGroupInboxes, ...allPrivateInboxes];
	return allInboxes;
}




export { authUser, getChatInfos, getInboxes };