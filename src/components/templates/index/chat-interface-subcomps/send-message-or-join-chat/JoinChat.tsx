"use client";
import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import { Button } from "ui/Button";
import { showSwal } from "u/helpers";
import { useRouter } from "next/navigation";

import { CurrentChatStatusContext } from "c/CurrentChatStatusProvider";
import { WebsocketContext } from "c/WebsocketProvider";
import { AllChatsAndInboxesContext } from "c/AllChatsAndInboxesProvider";

import type {
CurrentChatStatusContextType,
GroupType,
PrivateType,
GroupInbox,
PrivateInbox,
AllChatsAndInboxesContextType,
WebsocketContextType } from "u/types";




const JoinChat = () => {
	
	const router = useRouter();
	
	const { setAllChatRooms, setAllInboxes
	} = useContext(AllChatsAndInboxesContext) as AllChatsAndInboxesContextType;
	const { chatId, chatType, setRole } = useContext(CurrentChatStatusContext) as CurrentChatStatusContextType;
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	
	const [cutConnection, setCutConnection] = useState(true);
	useEffect(() => {
		
		if (socket) {
			socket.emit("joinChatRoom", chatId);
		}
		console.log(33, cutConnection)
		
		return () => {
			console.log(36, cutConnection)
			if (cutConnection) {
				socket.emit("leaveChatRoom", chatId);
				
			} else {
				socket.emit("joinChatRoom", chatId);
			}
		}
		
	}, [cutConnection])
	
	
	
	const joinChat = async () => {
		
		const res = await fetch(`/api/join/${chatType}/${chatId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			}
		});
		
		if (res.status === 201) {
			setCutConnection(false);
			
			const { newGroupChat, lastMessage, newInbox } = await res.json();
			
			setAllChatRooms((prev: (GroupType | PrivateType)[]) => [ newGroupChat, ...prev ]);
			setAllInboxes((prevInboxes: (GroupInbox | PrivateInbox)[]) => [ newInbox, ...prevInboxes ]);
			
			socket.emit("createNewChatRoom", newGroupChat);
			socket.emit("message", lastMessage, newGroupChat._id);
			
			setRole("USER");
			router.refresh();
			
		} else if (res.status === 404) {
			showSwal(`there is no such ${chatType}`, "error", "ok");
			
		} else {
			showSwal("there was a problem, try again", "error", "ok");
		}
		
	}
	
	
	return <Button className="w-full text-white hover:bg-primary-hover" onClick={joinChat} >Join</Button>
}


export default JoinChat;