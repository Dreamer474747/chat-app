"use client";
import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import { Button } from "ui/Button";
import { showSwal } from "u/helpers";
import { useRouter } from "next/navigation";

import { CurrentChatContext } from "c/CurrentChatProvider";
import { WebsocketContext } from "c/WebsocketProvider";

import type { CurrentChatContextType, WebsocketContextType } from "u/types";




const JoinChat = () => {
	
	const router = useRouter();
	
	const { chatId, chatType, updateRole } = useContext(CurrentChatContext) as CurrentChatContextType;
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	
	const [cutConnection, setCutConnection] = useState(true);
	useEffect(() => {
		
		if (socket) {
			socket.emit("joinChat", chatId);
		}
		console.log(33, cutConnection)
		
		return () => {
			console.log(36, cutConnection)
			if (cutConnection) {
				socket.emit("leaveChat", chatId);
				
			} else {
				socket.emit("joinChat", chatId);
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
			
			const { groupInfo, lastMessage } = await res.json();
			socket.emit("createNewChat", groupInfo);
			socket.emit("message", lastMessage, groupInfo._id);
			
			updateRole("USER");
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