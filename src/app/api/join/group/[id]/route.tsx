import connectToDB from "db";
import UserModel from "@/models/User";
import GroupModel from "@/models/Group";
import GroupMessageModel from "@/models/GroupMessage";

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
		
		// 'params.id' is a group's _id. is it valid?
		const isValid = isValidObjectId(params.id);
		if (!isValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// 'params.id' is a group's _id. does this group exist in our database?
		const isExist = await GroupModel.findOne({ _id: params.id });
		if (!isExist) {
			return Response.json({message: "group does not exist"},
			{status: 404});
		}
		
		
		const joinUserInGroup = await UserModel.findOneAndUpdate(
			{ _id: user._id },
			{
				$push: {
					groups: params.id
				}
			}
		);
		
		if (joinUserInGroup) {
			
			const userInfo: any = await UserModel.findOne({ _id: user._id }, "name -_id");
			
			const newGroupMessage = await GroupMessageModel.create({
				body: `${userInfo.name} joined the group`,
				sender: user._id,
				isSeen: true,
				isSystemMessage: true,
				group: params.id,
			});
			
			const changeGroupLastMessage = await GroupModel.findOneAndUpdate(
				{ _id: params.id },
				{
					lastMessage: `${userInfo.name} joined the group`,
					lastMessageDate: newGroupMessage.createdAt
				}
			);
			
			const groupInfo = await GroupModel.findOne({ _id: params.id });
			const lastMessage: MessageType = {
				_id: newGroupMessage._id,
				body: `${userInfo.name} joined the group`,
				createdAt: newGroupMessage.createdAt,
				sender: user._id,
				isSystemMessage: true
			}
			
			return Response.json({ groupInfo, lastMessage }, { status: 201 });
			
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