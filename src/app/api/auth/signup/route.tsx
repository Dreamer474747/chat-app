import connectToDB from "db";
import UserModel from "@/models/User";

import {
hashPassword,
createAccessToken,
createRefreshToken,
createNonRememberedRT
} from "u/auth";

import { passwordRegex, emailRegex, idRegex } from "u/constants";




export async function POST(req: Request) {
	
	try {
		connectToDB();
		const { name, email, password, id, rememberMe } = await req.json();
		
		// validation
		
		if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string"
		|| typeof id !== "string" || typeof rememberMe !== "boolean") {
		
			return Response.json({ message: "invalid data" },
			{status: 422});
		}
		
		if (!name.trim() || !email.trim() || !password.trim() || !id.trim()) {
			return Response.json({ message: "invalid data" },
			{status: 422});
		}
		
		if (name.length > 15) {
			return Response.json({ message: "invalid data" },
			{ status: 422 });
		}
		
		// the "test" method has some issues. so always use "match" method.
		const isEmailValid = email.match(emailRegex)
		const isIdValid = id.match(idRegex)
		const isPasswordValid = password.match(passwordRegex)
		
		if (!isEmailValid || !isPasswordValid || !isIdValid) {
			return Response.json({ message: "invalid data" },
			{ status: 422 });
		}
		
		// is there a user with the same email?
		const isEmailExist = await UserModel.findOne({ email }, "_id")
		if (isEmailExist) {
			return Response.json({ message: "email already in use" },
			{ status: 409 });
		}
		
		// is there a user with the same id?
		const isIdExist = await UserModel.findOne({ id }, "_id")
		if (isIdExist) {
			return Response.json({ message: "id already in use" },
			{ status: 408 });
		}
		
		const hashedPassword = await hashPassword(password);
		
		const accessToken = createAccessToken({ email });
		const headers = new Headers();
		headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true;`);
		
		let refreshToken;
		if (rememberMe) {
			
			refreshToken = createRefreshToken({ email });
			headers.append("Set-Cookie", `refresh-token=${refreshToken};path=/;httpOnly=true;`);
		} else {
			
			refreshToken = createNonRememberedRT({ email });
			headers.append("Set-Cookie", `refresh-token=${refreshToken};path=/;httpOnly=true;`);
		}
		
		const user = await UserModel.create({
			name,
			email,
			id,
			password: hashedPassword,
			refreshToken
		})
		
		if (user) {
			return Response.json({ message: "user created successfully :))" },
			{
				status: 201,
				headers
			})
			
		} else {
			return Response.json({ message: "there was a problem, try again" },
			{ status: 500 })
		}
		
		
	} catch(err) {
		console.log(err)
		return Response.json({message: "/auth/signup api error"},
		{ status: 500 });
	}
	
}
