import connectToDB from "db";
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
		
		const { chatId } = await req.json();
		
		const isChatIdValid = isValidObjectId(chatId);
		if (!isChatIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// is there a private chat with the same _id as chatId?
		const isExist = await PrivateModel.findOne({ _id: chatId }, "_id")
		if (!isExist) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const messages = await PrivateMessageModel.find(
			{ private: chatId },
			"-__v -updatedAt -private"
		)
		
		if (messages) {
			return Response.json({ messages });
		
		} else {
			return Response.json({message: "there was a problem, try again"},
			{status: 500});
		}
		
		
	} catch(err) {
		
		return Response.json({message: "there was a problem, try again"},
		{ status: 500 });
	}
	
}


