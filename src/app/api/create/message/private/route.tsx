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
		
		const { body, chatId: privateId } = await req.json();
		
		if (typeof body !== "string" || typeof privateId !== "string") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (!body.trim() || !privateId.trim()) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const isPrivateIdValid = isValidObjectId(privateId);
		
		if (!isPrivateIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		// does this private conversation exist in our database?
		const isPrivateExist = await PrivateModel.findOne({ _id: privateId }, "_id")
		if (!isPrivateExist) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		
		const message = await PrivateMessageModel.create({
			body,
			sender: user._id,
			isSeen: true,
			private: privateId,
		})
		
		// updating the lastMessage field of this private conversation(which the value of its _id is
		// 'privateId') to the most recent message that has been sent to this conversation.(which is
		// the 'body')
		await PrivateModel.findOneAndUpdate(
			{ _id: privateId },
			{ lastMessage: body, lastMessageDate: message.createdAt }
		);
		
		const lastMessage = {
			_id: message._id,
			body: message.body,
			createdAt: message.createdAt,
			sender: message.sender,
		}
		
		return Response.json({lastMessage}, {status: 201});
		
		
	} catch(err) {
		
		return Response.json({message: "/create/message/private api error"},
		{ status: 500 });
	}
	
}