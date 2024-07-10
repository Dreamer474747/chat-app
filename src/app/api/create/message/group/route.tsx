import connectToDB from "db";
import UserModel from "@/models/User";
import GroupModel from "@/models/Group";
import GroupMessageModel from "@/models/GroupMessage";
import GroupInboxModel from "@/models/GroupInbox";

import { isValidObjectId } from "mongoose";
import { authUser } from "u/serverHelpers";

import { MessageType } from "u/types";


export async function POST(req: Request) {
	
	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" },
			{ status: 401 });
		}
		
		const { body, isSystemMessage, chatId: groupId } = await req.json();
		
		// isSystemMessage is not a required field.
		if (isSystemMessage && typeof isSystemMessage !== "boolean") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (typeof body !== "string" || typeof groupId !== "string") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (!body.trim() || !groupId.trim()) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		const isGroupIdValid = isValidObjectId(groupId);
		
		if (!isGroupIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		// does this group conversation exist in our database?
		const isGroupExist = await GroupModel.findOne({ _id: groupId }, "_id")
		if (!isGroupExist) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		let message;
		if (isSystemMessage) {
			
			message = await GroupMessageModel.create({
				body,
				sender: user._id,
				isSeen: false,
				isSystemMessage,
				group: groupId
			})
		} else {
			
			message = await GroupMessageModel.create({
				body,
				sender: user._id,
				isSeen: false,
				group: groupId
			})
		}
		
		await GroupInboxModel.findOneAndUpdate(
			{ user: user._id, group: groupId },
			{ lastSeenMessage: message._id }
		);
		
		// updating the lastMessage field of this group conversation(which the value of its
		// _id is 'groupId') to the most recent message that has been sent to this conversation
		// (which is the 'body')
		await GroupModel.findOneAndUpdate(
			{ _id: groupId },
			{ lastMessage: body, lastMessageDate: message.createdAt }
		);
		
		const userName = await UserModel.findOne({ _id: user._id }, "name -_id");
		
		const lastMessage: MessageType = {
			_id: message._id,
			body: message.body,
			createdAt: message.createdAt,
			isSeen: false,
			sender: {
				_id: message.sender,
				name: userName.name
			},
		}
		// if 'isSystemMessage' exists, we will add the 'isSystemMessage' property to the
		// lastMessage constant.
		if (isSystemMessage) {
			lastMessage.isSystemMessage = true;
		}
		
		return Response.json({ lastMessage }, {status: 201});
		
		
	} catch(err) {
		
		return Response.json({message: "/create/message/group api error"},
		{ status: 500 });
	}
	
}