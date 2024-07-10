//@ts-nocheck
// sweetalert has some problems with tsc and thats not an issue thats coming from me.
// i tried to fix it but i couldn't. hope you can understand that.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "ui/Button";
import { Checkbox } from "ui/Checkbox";
import { Input } from "ui/Input";
import { Label } from "ui/Label";

import { showSwal } from "u/helpers";
import swal from "sweetalert";
import { idRegex, emailRegex, passwordRegex } from "u/constants";


type LoginParams = {
	showRegisterForm: () => void
}


const Login = ( { showRegisterForm }: LoginParams ) => {
	
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	
	const [isVisible, setIsVisible] = useState(false);
	
	const router = useRouter();
	
	
	const signin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		const isIdentifierAnEmail = identifier.match(emailRegex);
		const isIdentifierAnId = identifier.match(idRegex);
		
		if (!isIdentifierAnEmail && !isIdentifierAnId) {
			return showSwal("you're email or id is not valid", "error", "ok")
		}
		
		if (password.length < 8 || password.length > 15) {
			return showSwal("password must be between 8 to 15 characters", "error", "ok");
		}
		const isPasswordValid = password.match(passwordRegex)
		if (!isPasswordValid) {
			return showSwal(
			`a valid password must have atleast a lower case letter, an upper case letter, 
			a number and a special character(@$!%*#.?^_-)`, "error", "ok");
		}
		
		
		const res = await fetch("/api/auth/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ identifier, password, rememberMe })
		})
		
		const data = await res.json();
		
		if (res.status === 200) {
			setIdentifier("");
			setPassword("");
			setRememberMe(false);
			swal({
				title: "logged in successfully",
				icon: "success",
				buttons: "ok"
			}).then(() => router.replace("/"))
		
		} else if (res.status === 404) {
			showSwal("there is no such user with the given information", "error", "ok");
			
		} else if (res.status === 500) {
			showSwal("there was a problem, try again", "error", "ok");
			
		} else if (res.status === 401) {
			showSwal("you're data and the password does not match", "error", "ok");
			
		} else { // (res.status === 422)
			return showSwal("youre onto something(⌐■_■)", "error", "ok");
		}
	}
	
	
	
	
	return (
		<>
			
			<form
				className="flex flex-col mx-auto mt-10 text-white max-w-sm px-3"
				onSubmit={(e) => signin(e)}
			>
				<div className="grid w-full items-center gap-1.5 mb-4">
					<Label htmlFor="emailOrId">Email or Id</Label>
					<Input
						placeholder="Email or Id"
						className=""
						id="emailOrId"
						value={identifier}
						type="text"
						onChange={(e) => setIdentifier(e.target.value)}
					/>
				</div>
				
				<div className="flex w-full items-end mb-4">
					
					<div className="w-full">
						<Label htmlFor="password">Password</Label>
						<Input
							placeholder="Password"
							className=""
							id="password"
							value={password}
							type={isVisible ? "text" : "password"}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					
					<Button
						className="fill-white bg-primary hover:bg-primary-hover ml-3"
						type="button"
						onClick={() => setIsVisible(!isVisible)}
					>
						{isVisible ? (
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>
						)}
					</Button>
					
				</div>
				
				<div className="flex mb-4 justify-center">
					
					<Label htmlFor="rememberMe">remember me</Label>
					<Checkbox
						id="rememberMe"
						defaultChecked={rememberMe}
						onChange={() => setRememberMe(prev => !prev)}
						className="ml-2"
					/>
					
				</div>
				
				<div className="flex flex-col ">
					<Button
						type="submit"
						className="mb-2 bg-primary hover:bg-primary-hover"
					>sign in</Button>
					
					<Button
						onClick={showRegisterForm}
						className="bg-primary hover:bg-primary-hover"
					>dont have an account? sign up</Button>
				</div>
			</form>
		</>
	)

}

export default Login;