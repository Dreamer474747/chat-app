import connectToDB from "db";
import UserModel from "@/models/User";
import ChannelModel from "@/models/Channel";
import ChannelMessageModel from "@/models/ChannelMessage";

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
		const { name, id, owner } = body;
		
		// Validation
		
		if (typeof name !== "string" || typeof id !== "string" || typeof owner !== "string") {
			
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		if (!name.trim() || !id.trim() || !owner.trim()) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const isIdValid = id.match(idRegex);
		if (!isIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const isOwnerIdValid = isValidObjectId(owner)
		if (!isOwnerIdValid) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		// is there a channel with the same id in the database already?
		const isIdUnique = await ChannelModel.findOne({ id }, "_id");
		if (isIdUnique) {
			return Response.json({message: "duplicate id"},
			{status: 409});
		}
		
		// does this user(which is the owner in this case) exist in our database?
		const isOwnerExist = await UserModel.findOne({ _id: owner }, "_id");
		if (!isOwnerExist) {
			return Response.json({message: "invalid data !!"},
			{status: 422});
		}
		
		const newChannel = await ChannelModel.create({
			name,
			id,
			owner,
			lastMessage: "Channel created"
		})
		
		if (newChannel) {
			// first message of the channel
			const message = await ChannelMessageModel.create({
				body: "Channel created",
				sender: owner,
				isSeen: true,
				isSystemMessage: true,
				channel: newChannel._id
			})
			
			if (message) {
				return Response.json(
					{message: "channel created successfully :))"},
					{status: 201}
				);
				
			} else {
				return Response.json(
					{message: "there was a problem, try again"},
					{status: 500}
				);
			}
		
		} else {
			return Response.json(
				{message: "there was a problem, try again"},
				{status: 500}
			);
		}
		
		
	} catch(err) {
		
		return Response.json({message: "/create/channel api error"},
		{ status: 500 });
	}
	
}