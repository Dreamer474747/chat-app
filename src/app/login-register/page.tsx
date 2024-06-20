"use client"

import { useState } from "react";

import Login from "t/login-register/Login";
import Register from "t/login-register/Register";

import { authTypes } from "@/utils/constants";




const Page = () => {
	
	const [authType, setAuthType] = useState(authTypes.LOGIN);
	
	const showRegisterForm = () => setAuthType(authTypes.REGISTER);
	const showloginForm = () => setAuthType(authTypes.LOGIN);
	
	
	
	return (
	
		<div>
		
			{authType === "LOGIN" ? (
				<Login showRegisterForm={showRegisterForm} />
			) : (
				<Register showloginForm={showloginForm} />
			)}
			
		</div>
	)
}


export default Page;