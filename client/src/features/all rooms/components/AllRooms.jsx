import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectUserData } from "../../../shared/userDataSlice";
import { selectUserRooms, userRoomsCollected } from "../../../shared/userRoomsSlice";
import { activeRoomChanged } from "../../../shared/activeRoomSlice";

import { getAllRooms } from "../services/services";

import { socket } from "../../../shared/socket";





const AllRooms = () => {
	// this is the component where all the chat rooms of the user will display.
	
	const dispatch = useDispatch();
	
	const [loading, setLoading] = useState(false);
	const [isUserRoomsReallyEmpty, setIsUserRoomsReallyEmpty] = useState(false);
	
	const userData = useSelector(selectUserData);
	const userRooms = useSelector(selectUserRooms);
	
	
	
	useEffect(() => {
		
		/* (read the line ## first.)
		
		basically what happens here is that we get all of the room objects that exist in the json server and we 
		filter all of the rooms that has the user as one of its members.
		
		you are going to read the 2 lines above and think: what if we had 100,000 room objects? this is some very bad code.
		hear me out: this chat app is not going to be a very huge app. its not meant to be something like telegram or
		whats app or what ever.
		
		its most likely for some people who just want to have a personal chat app. where no one is spying on them.
		so basically, there is never going to be 100,000 room objects or more. its probebly going to be about 200
		or 300 rooms at most. nothing to worry about.
		
		why do we have to do it this way? because i thought about the other ways of getting a user's room objects, and
		in my case, if we try to do any of the other possible ways, we would have to make more then two requests to
		the json server every time a user creates a room. and i dont like that because if i ever want to add group
		chats to this app, it would cause problems for me.
		
		but hey... maybe i change my mind in the future.
		
		
		edit: how many new chat rooms we create in a persoanl chat app? probebly between 70 to 300. how many times
		do we enter the chat app? more then 70 to 300 definitly! so i guess i was wrong about what i had thought erliar.
		i will change the database later and i will change the logic later! i wish i had thinked of this erliar. */
		
		
		const getRooms = async () => {
			const { data: allRooms } = await getAllRooms();
			
			// we find all the rooms in which the user is a memeber, and then put those rooms in the userRoomsHelper array.
			let userRoomsHelper = [];
			
			for (let i = 0; i < allRooms.length; i++) {
				
				//## add the "console.log(allRooms[i])" line here to understand what i mean by saying 'room object'.
				
				const { members } = allRooms[i];
				
				// in the line 69, we find out if the current room object(which is the allRooms[i])
				// has the id of the user in its members or not.
				const isExist = members.find(member => member.id === userData.id);
				
				console.log(isExist)
				
				// with the line below, we prevent the userRoom array from getting duplicate room object.
				const isDuplicate = userRoomsHelper.some(room => room.id === allRooms[i].id);
				
				if (isExist && !isDuplicate) {
					userRoomsHelper.push(allRooms[i]);
				}
			}
			
			dispatch(userRoomsCollected(userRoomsHelper));
			
			console.log(userRooms);
			
			socket.emit("joinUserInThisRooms", userRoomsHelper);
			
			setLoading(false);
		}
		
		
		/* when user first enters the app, the userRooms array is empty. so, the length of it would be 0. and the 
		isUserRoomsReallyEmpty const would be false, so we would enter the if statement below. and then the user would
		see that his rooms are getting displayid to him. with no problem.
		
		now, if the user goes to another route, the AllRooms component would be unmounted. when the user comes back to the
		"/rooms" route, the AllRooms component will be mounted, but this time, we will not enter the if statement below.
		because we dont need to get all of the rooms again and filter them. we already have what we need.
		
		also, we need to make sure that entering the if statement below only happens once. thats why we use the
		isUserRoomsReallyEmpty constant.
		*/
		if (userRooms.length === 0 && !isUserRoomsReallyEmpty) {
			getRooms();
			setLoading(true);
			setIsUserRoomsReallyEmpty(true);
		}
	
	})
	
	console.log(userRooms);
	
	
	
	
	
	const otherChatPartnerFinder = roomMembers => {
	
		const otherChatPartner = roomMembers.find(member => member.id !== userData.id);
		console.log(otherChatPartner.name)
		return otherChatPartner.name;
	
	}
	
	
	const timeConverter = timeStamp => {
		const time = new Date(timeStamp);
		return {
			hour: time.getHours(),
			minute: time.getMinutes()
		}
	}
	
	
	
	
	return (
		<>
		
		<p>{ userData.username }</p>
		
		{loading? <p>loading</p> : 
			(userRooms.length === 0)? <p>you def need a friend</p> :
			userRooms.map((room, index) => (
			
				<div key={index} style={{ border: "1px solid black", marginBottom: "1rem", padding: "1rem" }}>
				
					<Link
					to="/chat"
					onClick={() => {
						dispatch(activeRoomChanged(room.id));
					}}
					> {otherChatPartnerFinder(room.members)} </Link>
					
					<div>
					
						<p>{room.lastMessage.senderUsername}: {room.lastMessage.text}</p>
						
						<p>{timeConverter(room.lastMessage.time).hour}: {timeConverter(room.lastMessage.time).minute}</p>
					
					</div>
				
				</div>
			
			))
		
		}
		
		</>
	)
}

export default AllRooms;