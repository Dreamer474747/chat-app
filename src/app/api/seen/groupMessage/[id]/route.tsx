import connectToDB from "db";
import GroupInboxModel from "@/models/GroupInbox";
import GroupMessageModel from "@/models/GroupMessage";

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
		
		// return Response.json({ messageId: `group message id: ${messageId}` });
		
		// 'messageId' is a message's _id. is it a valid object id?
		const isValid = isValidObjectId(messageId);
		if (!isValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// does this message exist in our database?
		const isMessageExist = await GroupMessageModel.findOne({ _id: messageId }, "group")
		console.log(36, isMessageExist)
		if (!isMessageExist) {
			return Response.json({message: "message does not exist"},
			{status: 404});
		}
		
		const updateMessage = await GroupMessageModel.findOneAndUpdate(
			{ _id: messageId },
			{ isSeen: true }
		);
		
		// _id: { $gt: messageId }, group: isMessageExist.group, isSeen: true,
		
		if (updateMessage) {
			
			const isTheNewSeenMessageTheLastSeenMessage = await GroupMessageModel.findOne({
				$or: [
					{ _id: { $gt: messageId }, group: isMessageExist.group, isSeen: true },
					{ _id: { $gt: messageId }, group: isMessageExist.group, sender: user._id }
				]
			}, "body -_id");
			console.log(52, "g", isTheNewSeenMessageTheLastSeenMessage)
			
			
			if (!isTheNewSeenMessageTheLastSeenMessage) {
				/* if the "isTheNewSeenMessageTheLastSeenMessage" constant has a value, it means that
				there was a message with the isSeen field of 'true' that comes after the message
				with the _id field of "messageId".
				
				or that the user added a new message to the conversation. making the last seen message
				of the chat for himself, to be his own message.
				
				if the "isTheNewSeenMessageTheLastSeenMessage" constant does not have a value, we
				should update his group inbox's "lastSeenMessage" field, to the messageId value. */
				
				const updateUserGroupInbox = await GroupInboxModel.findOneAndUpdate(
					{ user: user._id, group: isMessageExist.group },
					{ lastSeenMessage: messageId }
				)
				
				return Response.json({ isLastMessage: true });
			}
			
			return Response.json({ isLastMessage: false });
			
		} else {
			return Response.json({message: "there was a problem, try again"},
			{status: 500});
		}
		
	} catch(err) {
		console.log(err)
		return Response.json({message: "/search/user api error"},
		{ status: 500 });
	}
}