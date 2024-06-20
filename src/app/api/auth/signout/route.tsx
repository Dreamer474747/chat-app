import { cookies } from "next/headers";



export async function POST(req: Request) {
	
	cookies().delete("token");
	
	return Response.json({ message: "logged out successfully" })
}