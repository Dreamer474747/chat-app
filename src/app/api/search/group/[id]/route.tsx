import connectToDB from "db";
import GroupInboxModel from "@/models/GroupInbox";
import GroupModel from "@/models/Group";

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
		
		const groupId = params.id;
		
		if (typeof groupId !== "string" || !groupId.trim()
		|| groupId.length < 5 || groupId.length > 15) {
			
			return Response.json({message: "invalid data !!"}, {status: 422});
		}
		
		const isIdValid = groupId.match(idRegex);
		if (!isIdValid) {
			return Response.json({message: "invalid data !!"}, {status: 422});
		}
		
		let results = await GroupModel.find({
			id: { $regex: groupId, $options: 'i' }
		}, "name id");
		
		if (!results) {
			return Response.json({ message: "there was a problem, try again" },
			{ status: 500 });
			
		} else if (results.length === 0) {
			return Response.json({ message: "there is no group id similar to the given id" },
			{ status: 404 });
		}
		
		/* imagine this 3 group ids: example1, example2, example3. also imagine that the user is
		a member of example1, but is not a member of example2 and example3. when user searches
		the 'example' id in the search input, he should only see the example2 and example3 groups.
		and should not see the example1 group in his search results. */
		const userGroupInboxes = await GroupInboxModel.find({ user: user._id }, "group -_id");
		
		if (!userGroupInboxes) {
			return Response.json({ message: "there was a problem, try again" },
			{ status: 500 });
			
		} else if (userGroupInboxes.length === 0) {
		
			results = results.sort((a: SearchResult, b: SearchResult) => {
				return a.id.length - b.id.length
			})
			
			return Response.json({ results: results.slice(0, 3) });
		}
		
		const userGroups = [];
		for (let i = 0; i < userGroupInboxes.length; i++) {
			userGroups.push(userGroupInboxes[i].group)
		}
		
		// 'userGroups' is an array filled with _ids of user's groups. add
		// "console.log(userGroups)" here to understand the code better.
		
		
		
		
		let filteredResults = [];
		for (let i = 0 ; i < results.length; i++) {
			
			const isExistInUserGroups = userGroups.some((groupId: string) => JSON.stringify(groupId) === JSON.stringify(results[i]._id));
			
			if (!isExistInUserGroups) {
				filteredResults.push(results[i]);
			}
		}
		
		if (filteredResults.length === 0) {
			return Response.json(
				{ message: `there was some group ids similar to the given id, but user was
				already a member to all of them` }, { status: 301 }
			);
		}
		
		/* every time user searches for an id, we should find all the wanted results, sort them
		from the search result with least characters to the search result with most characters,
		and then send the results array that only includes the first 3 items. */
		
		filteredResults = filteredResults.sort((a: SearchResult, b: SearchResult) => {
			return a.id.length - b.id.length
		})
		
		
		return Response.json({ results: filteredResults.slice(0, 3) });
		
		
	} catch(err) {
		console.log(err)
		return Response.json({message: "/search/group api error"},
		{ status: 500 });
	}
}