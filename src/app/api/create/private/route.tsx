import connectToDB from "db";
import UserModel from "@/models/User";
import PrivateModel from "@/models/Private";
import PrivateMessageModel from "@/models/PrivateMessage";

import { isValidObjectId } from "mongoose";
import { authUser } from "u/serverHelpers";


export async function POST(req: Request) {
	
	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" },
			{ status: 401 });
		}
		
		const { newChatmate, message } = await req.json();
		
		if (typeof newChatmate !== "string" || typeof message !== "string"
		|| !newChatmate.trim() || !message.trim()) {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// what is newChatmate? an objectId.
		const isValid = isValidObjectId(newChatmate)
		
		if (!isValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		// newChatmate is a user's _id.
		// does newChatmate exist in our database?
		const isExist = await UserModel.findOne({ _id: newChatmate }, "_id");
		if (!isExist) {
			return Response.json({message: "unvalid data !!"},
			{status: 422});
		}
		
		
		const newPrivateChat = await PrivateModel.create({
			chatmates: [ user._id, newChatmate ],
			lastMessage: message,
			lastMessageDate: new Date().toISOString()
		})
		
		if (newPrivateChat) {
			
			const firstMessage = await PrivateMessageModel.create({
				body: message,
				sender: user._id,
				isSeen: true,
				private: newPrivateChat._id,
				createdAt: newPrivateChat.lastMessageDate
			})
			
			const updateUser1 = await UserModel.findOneAndUpdate(
				{ _id: user._id },
				{
					$push: {
						privates: newPrivateChat._id
					}
				}
			);
			
			const updateUser2 = await UserModel.findOneAndUpdate(
				{ _id: newChatmate },
				{
					$push: {
						privates: newPrivateChat._id
					}
				}
			);
			
			const newInbox = await PrivateModel.findOne({ _id: newPrivateChat._id })
			.populate("chatmates", "name").lean();
			return Response.json({ newInbox }, {status: 201});
			
		} else {
			return Response.json(
				{message: "there was a problem, try again"},
				{status: 500}
			);
		}
		
		
	} catch(err) {
		
		return Response.json({message: "/create/private api error"},
		{ status: 500 });
	}
	
}