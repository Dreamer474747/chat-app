import connectToDB from "db";
import UserModel from "@/models/User";
import GroupModel from "@/models/Group";
import GroupMessageModel from "@/models/GroupMessage";
import GroupInboxModel from "@/models/GroupInbox";

import { isValidObjectId } from "mongoose";
import { authUser } from "u/serverHelpers";
import type { MessageType } from "u/types";



type ParamsType = {
	params: { id: string }
}

export async function PUT(req: Request, { params }: ParamsType) {

	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" },
			{ status: 401 });
		}
		
		const groupId = params.id;
		
		// 'groupId' is a group's _id. is it valid?
		const isValid = isValidObjectId(groupId);
		if (!isValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// does this group exist in our database?
		const isExist = await GroupModel.findOne({ _id: groupId });
		if (!isExist) {
			return Response.json({message: "group does not exist"},
			{status: 404});
		}
		
		
		const userInfo: any = await UserModel.findOne({ _id: user._id }, "name -_id");
		
		const newGroupMessage = await GroupMessageModel.create({
			body: `${userInfo.name} joined the group`,
			sender: user._id,
			isSeen: false,
			isSystemMessage: true,
			group: groupId,
		});
		
		
		if (newGroupMessage) {
			
			// creating a new inbox for the user who wants to join the group
			const newInbox = await GroupInboxModel.create({
				user: user._id,
				group: groupId,
				lastSeenMessage: newGroupMessage._id
			});
			
			// change group's lastMessage field to the most recent message
			// that has been sent to the group
			await GroupModel.findOneAndUpdate(
				{ _id: groupId },
				{
					lastMessage: `${userInfo.name} joined the group`,
					lastMessageDate: newGroupMessage.createdAt
				}
			);
			
			const newGroupChat = await GroupModel.findOne({ _id: groupId });
			const lastMessage: MessageType = {
				_id: newGroupMessage._id,
				body: `${userInfo.name} joined the group`,
				createdAt: newGroupMessage.createdAt,
				sender: user._id,
				isSeen: false,
				isSystemMessage: true
			}
			
			return Response.json({ newGroupChat, lastMessage, newInbox }, { status: 201 });
			
		} else {
			
			return Response.json({ message: "there was a problem, try again" },
			{status: 500});
		}
		
		
	} catch(err) {
		console.log(err)
		return Response.json({ message: "join/group api err" },
		{status: 500});
	}
}