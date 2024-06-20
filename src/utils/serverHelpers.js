import connectToDB from "@/configs/db";
import UserModel from "@/models/User";

import { cookies } from "next/headers";
import { verifyAccessToken } from "./auth";


const authUser = async () => {
	
	try {
		const token = cookies().get("token");
		
		let user = null;
		if (token) {
			
			connectToDB();
			const tokenPayload = verifyAccessToken(token.value);
			
			if (tokenPayload) {
				return user = await UserModel.findOne(
				{ email: tokenPayload.email }, "_id")
				.lean();
				// why do i get only the _id? better performance. imagine getting the whole
				// user data every time you try to authenticate user. we just trying to know
				// if the access token of user is valid or not.
			}
		}
		return user;
		
	} catch (err) {
		console.log("auth user error:", err)
	}
}


const getInbox = async () => {
	
	// "authUser" is only for authenticating user.
	// getInbox is for getting all the contacts and channels and groups of the user.
	
	try {
		const token = cookies().get("token");
		
		let allInbox = null;
		if (token) {
			
			connectToDB();
			const tokenPayload = verifyAccessToken(token.value);
			
			if (tokenPayload) {
				return allInbox = await UserModel.findOne(
				{ email: tokenPayload.email }, "groups privates")
				.populate("groups privates", "-__v")
				.lean();
			}
		}
		return allInbox;
		
	} catch(err) {
		console.log("getInbox error:", err)
	}
}


export { authUser, getInbox };