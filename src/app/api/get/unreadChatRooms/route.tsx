import connectToDB from "db";
import GroupMessageModel from "@/models/GroupMessage";
import PrivateMessageModel from "@/models/PrivateMessage";

import { authUser, getInboxes } from "u/serverHelpers";

import { PrivateInbox, GroupInbox } from "u/types";



export async function GET(req: Request) {
	
	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" },
			{ status: 401 });
		}
		
		const allInboxes = await getInboxes();
		
		const allUnreadChatRooms = [];
		
		for (let i = 0; i < allInboxes.length; i++) {
			
			if ((allInboxes[i] as GroupInbox).group) {
				const isUnreadMsgExist = await GroupMessageModel.findOne({
					_id: { $gt: allInboxes[i].lastSeenMessage }, group: (allInboxes[i] as GroupInbox).group
				}, "body -_id");
				
				if (isUnreadMsgExist) {
					allUnreadChatRooms.push((allInboxes[i] as GroupInbox).group)
				}
				
				
			} else {
				
				const isUnreadMsgExist = await PrivateMessageModel.findOne({
					_id: { $gt: allInboxes[i].lastSeenMessage }, private: (allInboxes[i] as PrivateInbox).private
				}, "_id");
				
				if (isUnreadMsgExist) {
					allUnreadChatRooms.push((allInboxes[i] as PrivateInbox).private)
				}
			}
		}
		
		return Response.json({ allUnreadChatRooms });
		
	} catch(err) {
		
		return Response.json({message: "there was a problem, try again"},
		{ status: 500 });
	}
	
}


