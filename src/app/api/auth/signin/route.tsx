import connectToDB from "db";
import UserModel from "@/models/User";

import {
verifyPassword,
createAccessToken,
createRefreshToken,
createNonRememberedRT
} from "u/auth";

import { passwordRegex, emailRegex, idRegex } from "u/constants";



export async function POST(req: Request) {
	
	try {
		connectToDB();
		const { identifier, password, rememberMe } = await req.json();
		
		// validation
		
		if (typeof identifier !== "string" || typeof password !== "string"
		|| typeof rememberMe !== "boolean") {
		
			return Response.json({ message: "invalid data" },
			{status: 422});
		}
		
		if (!identifier.trim() || !password.trim()) {
		
			return Response.json({ message: "invalid data" },
			{status: 422});
		}
		
		const isIdentifierAnEmail = identifier.match(emailRegex);
		const isIdentifierAnId = identifier.match(idRegex);
		
		if (!isIdentifierAnEmail && !isIdentifierAnId) {
			// if isIdentifierAnEmail and isIdentifierAnId are both invalid, then we dont need to check
			// if identifier is an email or an id.
			return Response.json({ message: "invalid data" },
			{ status: 422 });
		}
		
		const isPasswordValid = password.match(passwordRegex);
		if (!isPasswordValid) {
			return Response.json({ message: "invalid data" },
			{ status: 422 });
		}
		
		
		const user = await UserModel.findOne({
			$or: [{ id: identifier }, { email: identifier }]
		}, "password email")
		
		if (!user) {
			return Response.json({message: "user not found !!"},
			{status: 404});
		}
		
		// is the given password and the hashed password(the one in the database) the same?
		const isPasswordCorrect = await verifyPassword(password, user.password);
		if (!isPasswordCorrect) {
			return Response.json({message: "password and identifier does not match"},
			{status: 401})
		}
		
		const accessToken = createAccessToken({ email: user.email });
		const headers = new Headers();
		headers.append("Set-Cookie", `token=${accessToken};path=/;httpOnly=true;`);
		
		let refreshToken;
		if (rememberMe) {
			
			refreshToken = createRefreshToken({ email: user.email });
			headers.append("Set-Cookie", `refresh-token=${refreshToken};path=/;httpOnly=true;`);
		} else {
			
			refreshToken = createNonRememberedRT({ email: user.email });
			headers.append("Set-Cookie", `refresh-token=${refreshToken};path=/;httpOnly=true;`);
		}
		
		const isUserRTSetted = await UserModel.findOneAndUpdate(
			{ email: user.email }, { $set: { refreshToken } }
		);
		
		if (isUserRTSetted) {
		
			return Response.json({ message: "user logged in successfully :))" },
			{ status: 200, headers })
			
		} else {
			return Response.json({ message: "there was a problem, try again !!" },
			{ status: 500 });
		}
		
		
	} catch(err) {
		console.log(err)
		return Response.json({message: "/auth/signup api error"},
		{ status: 500 });
	}
	
}