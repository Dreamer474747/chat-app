import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../shared/userDataSlice";
import { selectUserRooms, userRoomsCollected } from "../../shared/userRoomsSlice";

import { Outlet, Link } from "react-router-dom";

import { Box, Button } from "@mui/material";

import { socket } from "../../shared/socket";







const MainLayout = () => {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	const userData = useSelector(selectUserData);
	const userRooms = useSelector(selectUserRooms);
	
	
	useEffect(() => {
		
		// if the user tryes to enter the "/rooms" route without login in first, he will be sent back to the "/" route.
		if (Object.keys(userData).length === 0) {
			navigate("/");
		}
		
		
		socket.on("message", (roomId, message, updatedRoomInfo) => {
			// i have fully explained that what happens in the next few lines in the ChatInterface component.
			const oldRoomIndex = userRooms.findIndex(room => room.id === roomId);
		
			const newUserRooms = [...userRooms];
			newUserRooms[oldRoomIndex] = updatedRoomInfo;
			
			dispatch(userRoomsCollected(newUserRooms));
		});
		
		
		return () => {
			socket.off("message");
		}
	})
	
	
	
	
	
	
	
	
	
	return (
		<Box
		style={{
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center",
			marginTop: "3rem"
		}}
		>
		
			<Outlet />
			
			<Box style={{ marginTop: "1rem" }}>
			
				<Button variant="contained" style={{ marginRight: "1rem" }}>
					<Link style={{ textDecoration: "none", color: "white" }} to="/rooms">all rooms</Link>
				</Button>
			
				<Button variant="contained" style={{ marginRight: "1rem" }}>
					<Link style={{ textDecoration: "none", color: "white" }} to="/rooms/options">options</Link>
				</Button>
			
				<Button variant="contained" style={{ marginRight: "1rem" }}>
					<Link style={{ textDecoration: "none", color: "white" }} to="/rooms/search">serach</Link>
				</Button>
			
			</Box>
			
		</Box>
	)
}

export default MainLayout;

