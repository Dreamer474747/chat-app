import connectToDB from "db";
import PrivateInboxModel from "@/models/PrivateInbox";
import PrivateMessageModel from "@/models/PrivateMessage";

import { isValidObjectId } from "mongoose";
import { authUser } from "u/serverHelpers";

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
		
		const messageId = params.id;
		
		// 'messageId' is a message's _id. is it a valid object id?
		const isValid = isValidObjectId(messageId);
		if (!isValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// does this message exist in our database?
		const isMessageExist = await PrivateMessageModel.findOne({ _id: messageId }, "private")
		if (!isMessageExist) {
			return Response.json({message: "message does not exist"},
			{status: 404});
		}
		
		const updateMessage = await PrivateMessageModel.findOneAndUpdate(
			{ _id: messageId },
			{ isSeen: true }
		);
		
		if (updateMessage) {
			
			const isTheNewSeenMessageTheLastSeenMessage = await PrivateMessageModel.findOne({
				$or: [
					{ _id: { $gt: messageId }, private: isMessageExist.private, isSeen: true },
					{ _id: { $gt: messageId }, private: isMessageExist.private, sender: user._id }
				]
			}, "body -_id")
			
			console.log(50, "p", isTheNewSeenMessageTheLastSeenMessage)
			
			
			if (!isTheNewSeenMessageTheLastSeenMessage) {
				/* if the "isTheNewSeenMessageTheLastSeenMessage" constant has a value, it means that
				there was a message with the isSeen field of 'true' that comes after the message
				with the _id of messageId.
				
				or that the user added a new message to the conversation. making the last seen message
				of the chat for himself, to be his own message.
				
				if the "isTheNewSeenMessageTheLastSeenMessage" constant does not have a value, we
				should update his private inbox's "lastSeenMessage" field, to the messageId value. */
				
				const updateUserPrivateInbox = await PrivateInboxModel.findOneAndUpdate(
					{ user: user._id, private: isMessageExist.private },
					{ lastSeenMessage: messageId }
				)
				
				return Response.json({ isLastMessage: true })
			}
			
			
			return Response.json({ isLastMessage: false })
			// the only reason im sending "{ isSeen: true }" is so that i can use the 200
			// status code in the front-end.
			
		} else {
			return Response.json({message: "there was a problem, try again"},
			{status: 500});
		}
		
	} catch(err) {
		//console.log(err)
		return Response.json({message: "/search/user api error"},
		{ status: 500 });
	}
}