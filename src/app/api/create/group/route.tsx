import connectToDB from "db";
import UserModel from "@/models/User";
import GroupModel from "@/models/Group";
import GroupMessageModel from "@/models/GroupMessage";

import { isValidObjectId } from "mongoose";
import { authUser } from "u/serverHelpers";
import { idRegex } from "u/constants";


export async function POST(req: Request) {
	
	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" },
			{ status: 401 });
		}
		
		const body = await req.json();
		const { name, id } = body;
		
		// Validation
		
		if (typeof name !== "string" || typeof id !== "string") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (!name.trim() || !id.trim()) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const isIdValid = id.match(idRegex);
		if (!isIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		// is there a group with the same id in the database already?
		const isIdExist = await GroupModel.findOne({ id }, "_id");
		if (isIdExist) {
			return Response.json({message: "duplicate id"},
			{status: 409});
		}
		
		const newGroup = await GroupModel.create({
			name,
			id,
			owner: user._id,
			lastMessage: "Group created",
			lastMessageDate: new Date().toISOString()
		})
		
		if (newGroup) {
			// first message of the group
			const message = await GroupMessageModel.create({
				body: "Group created",
				sender: user._id,
				isSeen: true,
				isSystemMessage: true,
				group: newGroup._id,
				createdAt: newGroup.lastMessageDate
			})
			
			const updateUserGroups = await UserModel.findOneAndUpdate({ _id: user._id },
			{
				$push: {
					groups: newGroup._id
				}
			})
			
			return Response.json({newGroup}, {status: 201});
			
		
		} else {
			return Response.json(
				{message: "there was a problem, try again"},
				{status: 500}
			);
		}
		
		
	} catch(err) {
		
		return Response.json({message: "/create/group api error"},
		{ status: 500 });
	}
	
}