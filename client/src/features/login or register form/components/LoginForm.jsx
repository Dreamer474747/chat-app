import { useEffect } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { signInSchema, signUpSchema } from "../../../app/validation/validation";

import { Box, Typography, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";

import { ToastContainer, toast } from "react-toastify";

import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../../shared/userDataSlice";
import { userRoomsCollected } from "../../../shared/userRoomsSlice";

import { socket } from "../../../shared/socket";

import { getUser } from "../../../shared/services/services";






const LoginForm = () => {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	/* we make the value of the userData state empty everytime that the user comes to the "/login" route. but why?
	
	imagine a user that is in the "/rooms" route. than he decides to go the previous route. so he clicks on the 
	arrow that is in the top left corner of his browser and goes to the "/login" route. now his id is no longer
	in the allConnectedUsers array, but his data is still in the userData state.
	
	so now, the user is not present in the server, but only present in the front end. which means now the user can
	login in the app for more than one time. which is a bug. so we just delete the data of the user from the front-end
	when ever he enteres the "/login" route.
	
	(write the reason why you write the line 44 here.)
	*/
	dispatch(userLoggedIn({}));
	dispatch(userRoomsCollected([]));
	
	
	let user = {};
		
	const userFinder = async formValue => {
	
		try {
			const { data } = await getUser(formValue.id);
			
			if (data.password === formValue.password) {
				
				socket.emit("login", formValue.id, socket.id)
				user = data;
				// if you go and check out the index.js file in the server directory, you can find out that what
				// will happen after the lines above gets executed.
				
			} else {
				
				toast.error("password and id does not match");
			}
			
		} catch(err) {
			
			console.log(err);
			toast.error("this id does not exist");
		}
	}
	
	
	
	
	
	useEffect(() => {
		
		socket.emit("loginFormDisplayed", socket.id);
		
		socket.on("userCanLogin", () => {
			console.log("this user can log in.")
			dispatch(userLoggedIn(user));
			navigate("/rooms");
		})
		
		// this is for when the user is already logged in and we want to prevent the user from logging in again.
		socket.on("alreadyLoggedIn", () => {
			toast.error("this user is already logged in");
		})
		
		
		return () => {
			socket.off("userCanLogin");
			socket.off("alreadyLoggedIn")
		};
	})
	
	
	
	const StyledBox = styled(Box)`
	& input::placeholder {
		font-size: 12px;
		color: #fff;
	}
	& input {
		color: #fff;
		font-size: 12px;
		width: 14rem;
	}
	`;
	
	


	
	
	
	
	
	
	
	
	
	
	
	return (
		<>
			
			<Box sx={{ flex: 1, height: "100vh", backgroundColor: "primary.main", paddingTop: "4rem" }}>
			<ToastContainer position="top-bottom" theme="colored" />
			
			<StyledBox
			sx={{
				margin: "0 auto 0",
				width: "280px",
				height: "260px",
				backgroundColor: "#1b1b1b",
				borderRadius: "15px",
				boxShadow: "4px 4px 7px 0px rgba(0,0,0,0.4)",
				padding: "1rem 0",
				display: "flex",
				flexDirection: "column",
			}}>
				
				<Typography
				variant="h5"
				sx={{
					textAlign: "center",
					color: "#fff",
					marginBottom: "1.5rem"
				}}
				>
					Log in
				</Typography>
			
				
				
				<Formik
				initialValues={{ id: "", password: "" }}
				validationSchema={signInSchema}
				onSubmit={(values) => {
					
					userFinder(values)
				}}
				>
			
					<Form
					autoComplete="off"
					style={{
						height: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
					>
						<Box sx={{ marginBottom: "1rem" }}>
							<Field
							as={TextField}
							variant="standard"
							type="text"
							name="id"
							placeholder="you're user id"
							/>
							<ErrorMessage
							name="id"
							render={ (msg) => (
								<Box
								sx={{
									color: "#008080",
									fontSize: "10.5px",
									margin: "0.5rem 0"
								}}
								>
									{msg}
								</Box>
							)}
							/>
						</Box>
					
						<Box sx={{ marginBottom: "0.5rem" }}>
							<Field
							as={TextField}
							variant="standard"
							type="password"
							name="password"
							placeholder="you're password"
							/>
							<ErrorMessage
							name="password"
							render={ (msg) => (
								<Box
								sx={{
									color: "#008080",
									fontSize: "10.5px",
									margin: "0.5rem 0"
								}}
								>
									{msg}
								</Box>
							)}
							/>
						</Box>
						
						<Button type="submit" sx={{ width: "100%", textTransform: "none" }}>Log in</Button>
						
					</Form>
				
				</Formik>
				
				<Button
				onClick={() => navigate("/")}
				sx={{ width: 1, color: "#FFA500", textTransform: "none", fontSize: "10px", marginTop: "0.2rem" }}
				>
					don't have an account? register
				</Button>
				
			</StyledBox>
		
		</Box>
		
		</>
	)
}

export default LoginForm;
