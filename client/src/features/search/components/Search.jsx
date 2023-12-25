import { useState } from "react";

import { getAllUsers, createRoom, createRoomMessages } from "../services/services";

import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import { selectUserData } from "../../../shared/userDataSlice";
import { selectUserRooms, userRoomsCollected } from "../../../shared/userRoomsSlice";

import _ from "lodash";







const Search = () => {
	
	const dispatch = useDispatch();
	
	const userRooms = useSelector(selectUserRooms);
	// in here, "userData" means user's personal information which is username and id and password."
	const userData = useSelector(selectUserData);
	
	
	// when we search for a user, we want to exclude the users we already chat with. thats why in
	// the allChatPartners constant, we hold the value of all the users that the current user has a chat room with.
	// you can write console.log(allChatPartners) after the for loop to better undersatnd what im saying.
	let allChatPartners = [];
	
	for (let i = 0; i < userRooms.length; i++) {
		
		const { members } = userRooms[i];
		
		const chatPartner = members.find(user => user.id !== userData.id);
		
		allChatPartners.push(chatPartner);
	}
	
	
	
	const [targetUsers, setTargetUsers] = useState([]);
	
	const searchUser = _.debounce(async e => {
		const inputValue = e.target.value;
		
		const { data: allUsers } = await getAllUsers();
		
		// the allOtherUsers constant holds the value of all users except for the current user whose information
		// is stored in the line 20.
		const allOtherUsers = allUsers.filter(user => user.id !== userData.id);
		
		
		/* we need an array of users that we dont have a chat room with. to achive that, first we create an array 
		and we name it nonChatPartnerUsers.
		
		nonChatPartnerUsers array in first is the same as the allOtherUsers array. but in the for loop below
		it, we exclude all of the chat partners that the current user has from the nonChatPartnerUsers array. */
		
		let nonChatPartnerUsers = allOtherUsers;
		
		for (let i = 0; i < allChatPartners.length; i++) {
			const chatPartnerIndex = nonChatPartnerUsers.findIndex(user => user.id === allChatPartners[i].id);
			
			nonChatPartnerUsers.splice(chatPartnerIndex, 1);
		}
		
		
		let allTargetUsers = nonChatPartnerUsers.filter(user => user.id.includes(inputValue));
		
		setTargetUsers(allTargetUsers);
	}, 750);
	
	
	
	const createNewChatRoom = async newChatPartner => {
		const time = new Date().toISOString();
		const id = nanoid();
		
		const newRoom = {
			id,
			members: [
				{
					name: userData.username,
					id: userData.id
				},
				{
					name: newChatPartner.username,
					id: newChatPartner.id
				}
			],
			lastMessage: {
				senderUsername: userData.username,
				text: `hello ${newChatPartner.username}`,
				time
			}
		}
		
		const newRoomMessages = {
			id,
			messages: [
				{
					senderId: userData.id,
					senderUsername: userData.username,
					isSeen: true,
					text: `hello ${newChatPartner.username}`,
					time
				}
			]
		}
		
		console.log(newRoom);
		console.log(newRoomMessages);
		
		try {
			await createRoom(newRoom);
			await createRoomMessages(newRoomMessages);
			
			// in the next 3 lines, we update the userRooms array and add the newRoom to it.
			const newUserRooms = [...userRooms];
			newUserRooms.push(newRoom);
			dispatch(userRoomsCollected(newUserRooms));
			
			// 
			const selectedChatPartnerIndex = targetUsers.findIndex(user => user.id === newChatPartner.id);
			targetUsers.splice(selectedChatPartnerIndex, 1);
			
			console.log("done!");
			
		} catch(err) {
			console.log(err);
		}
	}
	
	
	
	return (
		<>
		
			<h1>Search users here</h1>
			
			<input
			onChange={searchUser}
			/>
			
			<ul>
			
				{
					targetUsers?.map((user, index) => (
					
						<p
						style={{ cursor: "pointer" }}
						onClick={() => createNewChatRoom(user)}
						key={index}
						>
						{user.username} ({user.id})
						</p>
					
					))
				}
			
			</ul>
		
		</>
	)
}

export default Search;