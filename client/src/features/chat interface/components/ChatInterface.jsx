import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { selectUserData } from "../../../shared/userDataSlice";
import { selectCurrentActiveRoom, activeRoomChanged } from "../../../shared/activeRoomSlice";
import { selectUserRooms, userRoomsCollected } from "../../../shared/userRoomsSlice";

import { socket } from "../../../shared/socket";

import { Box, Button, Typography } from "@mui/material";

import {
getRoomMessages,
getRoomInfo,
updateRoomInfo,
updateRoomMessages
} from "../services/services";




const ChatInterface = () => {
	
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	// in here, "userData" means user's personal information which is username and id and password."
	const userData = useSelector(selectUserData);
	
	const userRooms = useSelector(selectUserRooms);
	
	// go check out the activeRoomSlice.js file to understand what is the concept of current active room.
	const currentActiveRoom = useSelector(selectCurrentActiveRoom);
	
	const [messageInput, setMessageInput] = useState("");
	
	const [loading, setLoading] = useState(true);
	const [allMessages, setAllMessages] = useState([]);
	
	const [otherChatPartner, setOtherChatPartner] = useState({});
	const [roomInfo, setRoomInfo]= useState({});
	
	useEffect(() => {
		
		// if the user tryes to enter the "/chat" route without login in first, he will be sent back to the "/" route.
		if (Object.keys(userData).length === 0) {
			navigate("/");
		}
		
		
		const getMessages = async () => {
			
			try {
				if (currentActiveRoom) {
					const { data } = await getRoomMessages(currentActiveRoom);
					console.log(data)
					setAllMessages(data.messages);
				}
				
			} catch(err) {
				console.log(err);
			}
			
			setLoading(false);
		}
		
		const findOtherChatPartnerAndFindRoomInfo = async () => {
			
			try {
				const { data } = await getRoomInfo(currentActiveRoom);
				
				const chatPartner = data.members.find(member => member.id !== userData.id);
				setOtherChatPartner(chatPartner);
				setRoomInfo(data);
				
			} catch(err) {
				console.log(err);
			}
		}
		
		// with the if statement below, we make sure that the getMessages and findOtherChatPartnerAndFindRoomInfo functions
		// only get executed once(everytime the user enters the "/chat" route).
		if (loading) {
			getMessages();
			findOtherChatPartnerAndFindRoomInfo();
		}
		
		
		socket.on("message", (roomId, message, updatedRoomInfo) => {
			if (roomId === currentActiveRoom) {
				setAllMessages([ ...allMessages, message ]);
			}
			
			roomInfoUpdater(updatedRoomInfo.id, updatedRoomInfo);
		})
		
		
		return () => {
			socket.off("message");
		}
		
	})
	
	
	
	const messageInputChange = e => {
		setMessageInput(e.target.value);
	}
	
	
	
	const roomInfoUpdater = (roomId, updatedRoomInfo) => {
		
		/* inside the sendMessage function, we register the necessary changes in the json server with http requests. now
		we have to apply those changes in the front end by ourselves. first of all, the userRooms state needs to be changed.
		because with sending a new message, the last message of a room will change.
		
		so first, we find the index of the room that we need to change in the userRooms array, and then we create
		a replica of the userRooms state(because you cant change a state in redux directly), and then we change that
		replica to the new array that has the latest message of the currentActiveRoom as its lastMessage property.
		and then we dispatch that replica to the redux store as the new state for the userRooms state.
		*/
		const oldRoomIndex = userRooms.findIndex(room => room.id === roomId);
		
		const newUserRooms = [...userRooms];
		newUserRooms[oldRoomIndex] = updatedRoomInfo;
		
		dispatch(userRoomsCollected(newUserRooms));
	}
	
	
	
	const sendMessage = async () => {
		const time = new Date().toISOString();
		
		const updatedRoomInfo = {
			...roomInfo,
			lastMessage: {
				senderUsername: userData.username,
				text: messageInput,
				time
			}
		}
		
		console.log(updatedRoomInfo);
		
		
		
		const newMessage = {
			senderId: userData.id,
			senderUsername: userData.username,
			isSeen: true,
			text: messageInput,
			time
		}
		
		const updatedMessages = {
			id: currentActiveRoom,
			messages: [
				...allMessages,
				newMessage
			]
		}
		
		console.log(updatedMessages);
		
		
		try {
			await updateRoomInfo(updatedRoomInfo.id, updatedRoomInfo);
			// we could have just used currentActiveRoom instead of updatedRoomInfo.id
			await updateRoomMessages(updatedMessages.id, updatedMessages);
			
			roomInfoUpdater(updatedRoomInfo.id, updatedRoomInfo);
			
			
			socket.emit("message", currentActiveRoom, newMessage, updatedRoomInfo);
			setAllMessages([ ...allMessages, newMessage ]);
			
		} catch(err) {
			console.log(err);
		}
	}
	
	
	
	
	
	return (
		<>
		
			<Box
			sx={{
				width: "45rem",
				height: "45rem",
				margin: "0 auto",
				marginTop: "3rem",
				backgroundColor: "#345678"
			}}
			>
			
				<Box>well well well</Box>
				
				<Box>
				
					{
						loading? <p>loading</p> :
						(allMessages?.length === 0)? <p>no messages yet</p> :
						
						allMessages?.map((message, index) => (
							<Box key={index}>
								
								{message.senderUsername}: {message.text}
							
							</Box>
						))
						
					}
				
				</Box>
				
				<input
				value={messageInput}
				onChange={messageInputChange}
				style={{ marginTop: "2rem" }}
				/>
				<Button
				onClick={sendMessage}
				style={{
					border: "1px solid black",
					marginLeft: "2rem"
				}}
				>
				send message
				</Button>
			
			</Box>
		
		</>
	)
}

export default ChatInterface;