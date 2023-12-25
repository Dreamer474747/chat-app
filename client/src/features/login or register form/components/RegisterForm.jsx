import { Formik, Form, Field, ErrorMessage } from "formik";
import { signInSchema, signUpSchema } from "../../../app/validation/validation";

import { Box, Typography, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";

import { Link, useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../../shared/userDataSlice";

import { createUser } from "../../../shared/services/services";






const RegisterForm = () => {
	
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
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	// i fully explained why we empty the userData state in the LoginForm component. we can create the same bug with the
	// RegisterForm component too. but this time, user can only login in the app two times. which is a baaaaaaaaaaad thing.
	dispatch(userLoggedIn({}));
	
	
	
	const userCreator = async newUser => {
		
		newUser.isLogin = false;
		
		try {
			
			await createUser(newUser);
			dispatch(userLoggedIn(newUser));
			navigate("/rooms");
			
		} catch(err) {
			
			toast.error("try another id");
		}
		
		
	}
	
	
	
	
	
	return (
		<>
			
			<Box sx={{ flex: 1, height: "100vh", backgroundColor: "primary.main", paddingTop: "4rem" }}>
			
			<ToastContainer position="top-bottom" theme="colored" />
			
			<StyledBox
			sx={{
				margin: "0 auto 0",
				width: "280px",
				height: "330px",
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
					Register
				</Typography>
			
				
				
				<Formik
				initialValues={{
					username: "",
					id: "",
					password: ""
				}}
				validationSchema={signUpSchema}
				onSubmit={(values) => {
					
					userCreator(values);
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
							name="username"
							placeholder="you're user name"
							/>
							<ErrorMessage
							name="username"
							render={(msg) => (
								<Box sx={{
									color: "#008080",
									fontSize: "11px",
									margin: "0.5rem 0"
								}}
								>
									{msg}
								</Box>
							)}
							/>
						</Box>
						
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
									fontSize: "10px",
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
									fontSize: "11px",
									margin: "0.5rem 0"
								}}
								>
									{msg}
								</Box>
							)}
							/>
						</Box>
						
						<Button type="submit" sx={{ width: "100%", textTransform: "none" }}>Register</Button>
						
					</Form>
				
				</Formik>
				
				<Button
				onClick={() => navigate("/login")}
				sx={{ width: 1, color: "#FFA500", textTransform: "none", fontSize: "10px" }}
				>
					already have an account? log in
				</Button>
				
			</StyledBox>
		
		</Box>
		
		</>
	)
}

export default RegisterForm;
