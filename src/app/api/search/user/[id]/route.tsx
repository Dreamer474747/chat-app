import connectToDB from "db";
import UserModel from "@/models/User";

import { authUser } from "u/serverHelpers";
import { idRegex } from "u/constants";


import { SearchResult } from "u/types";
type ParamsType = {
	params: { id: string }
}


export async function GET(req: Request, { params }: ParamsType) {
	
	try {
		connectToDB();
		const user = await authUser();
		if (!user) {
			return Response.json({ message: "login first, do stuff second" }, { status: 401 });
		}
		
		const userId = params.id; // userId can be something like "amir2@3" or "Re_Za78"
		
		if (typeof userId !== "string" || !userId.trim()
		|| userId.length < 5 || userId.length > 15) {
			
			return Response.json({message: "invalid data !!"}, {status: 422});
		}
		
		const isIdValid = userId.match(idRegex);
		if (!isIdValid) {
			return Response.json({message: "invalid data !!"}, {status: 422});
		}
		
		let results = await UserModel.find({
			id: { $regex: userId, $options: 'i' }
		}, "name id");
		
		if (!results) {
			return Response.json({ message: "there was a problem, try again" }, { status: 500 });
		}
		
		// i dont like the user to see his own account when searching.
		const isExist = results.some(result => JSON.stringify(result._id) === JSON.stringify(user._id))
		if (isExist) {
			results = results.filter(result => JSON.stringify(result._id) !== JSON.stringify(user._id))
		}
		
		
		if (results.length === 0) {
			return Response.json({ message: "there is no user id similar to the given id" },
			{ status: 404 });
		}
		
		/* read the code of the "/api/search/group/[id]/route.tsx" file first. */
		
		// the difference in here is that we dont deal with a chat's id here. we deal with user id.
		const { privates } = await UserModel.findOne({ _id: user._id }, "privates -_id").populate("privates", "chatmates -_id");
		
		
		const currentChatmates = [];
		for (let i = 0; i < privates.length; i++) {
			
			const chatmate = privates[i].chatmates.find((id: string) => JSON.stringify(id) !== JSON.stringify(user._id))
			currentChatmates.push(chatmate);
		}
		
		// now that we found all of the user's current chatmates ids, we can finally filter the results.
		
		let filteredResults = [];
		for (let i = 0 ; i < results.length; i++) {
			
			const isExistInCurrentChatmates = currentChatmates.some((chatmateId: string) => JSON.stringify(chatmateId) === JSON.stringify(results[i]._id));
			
			if (!isExistInCurrentChatmates) {
				filteredResults.push(results[i]);
			}
		}
		// if 'isExistInCurrentChatmates' is true, that means that the current user already has the
		// user with the "results[i]._id" _id, as one of his contacts. thats why we dont push that
		// result to the 'filteredResults' array.
		
		if (filteredResults.length === 0) {
			return Response.json(
				{ message: `there was some user ids similar to the given id, but the current user
				already had those users as a contact` },
				{ status: 301 }
			);
		}
		
		filteredResults = filteredResults.sort((a: SearchResult, b: SearchResult) => {
			return a.id.length - b.id.length
		})
		
		return Response.json({ results: filteredResults.slice(0, 3) });
		
		
	} catch(err) {
		console.log(err)
		return Response.json({message: "/search/user api error"},
		{ status: 500 });
	}
	
}