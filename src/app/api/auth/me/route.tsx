import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/auth";
import connectToDB from "db";
import UserModel from "@/models/User";



export async function GET(req: Request) {
	
	try {
		// connectToDB();
		// const isUserAuthorised = await authUser();
		// if (!isUserAuthorised) {
			// return Response.json({ message: "login first, do stuff second" },
			// { status: 401 });
		// }
		
		
		
		// const user = await UserModel.findOne({ _id: userId })
		// if (!user) {
			// return Response.json({ message: "invalid data" },
			// { status: 422 });
		// }
		
		return Response.json({ message: "test message" })
		
		
	} catch(err) {
		
		return Response.json({message: "/auth/me api error"}, { status: 500 });
	}
	
}