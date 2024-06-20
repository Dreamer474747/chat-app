import connectToDB from "db";
import UserModel from "@/models/User";
import GroupModel from "@/models/Group";
import GroupMessageModel from "@/models/GroupMessage";

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
		
		const { body, isSystemMessage, chatId: group } = await req.json();
		
		// isSystemMessage is not a required field.
		if (isSystemMessage && typeof isSystemMessage !== "boolean") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (typeof body !== "string" || typeof group !== "string") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (!body.trim() || !group.trim()) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		const isGroupIdValid = isValidObjectId(group);
		
		if (!isGroupIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		// does this group conversation exist in our database?
		const isGroupExist = await GroupModel.findOne({ _id: group }, "_id")
		if (!isGroupExist) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		let message;
		if (isSystemMessage) {
			
			message = await GroupMessageModel.create({
				body,
				sender: user._id,
				isSeen: true,
				isSystemMessage,
				group
			})
		} else {
			
			message = await GroupMessageModel.create({
				body,
				sender: user._id,
				isSeen: true,
				group
			})
		}
		
		// updating the lastMessage field of this group conversation(which the value of its _id is 'group')
		// to the most recent message that has been sent to this conversation.(which is the 'body')
		await GroupModel.findOneAndUpdate(
			{ _id: group },
			{ lastMessage: body, lastMessageDate: message.createdAt }
		);
		
		const userName = await UserModel.findOne({ _id: user._id }, "name _id");
		
		const lastMessage: MessageType = {
			_id: message._id,
			body: message.body,
			createdAt: message.createdAt,
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
		
		return Response.json({lastMessage}, {status: 201});
		
		
	} catch(err) {
		
		return Response.json({message: "/create/message/group api error"},
		{ status: 500 });
	}
	
}