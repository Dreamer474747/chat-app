"use client";
import { useContext, useState } from "react";

import { CurrentChatStatusContext } from "c/CurrentChatStatusProvider";
import { WebsocketContext } from "c/WebsocketProvider";
import { AllChatsAndInboxesContext } from "c/AllChatsAndInboxesProvider";

import { Button } from "ui/Button";
import { Input } from "ui/Input";

import type {
CurrentChatStatusContextType,
WebsocketContextType,
AllChatsAndInboxesContextType,
GroupType,
PrivateType,
GroupInbox,
PrivateInbox,
MessageType } from "u/types";

import { showSwal } from "u/helpers";




// this component is only used for private chats that have 0 messages.
const SendFirstMessage = () => {
	
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	const { newChatmate, setRole, setChatId, setNewChatmate
	} = useContext(CurrentChatStatusContext) as CurrentChatStatusContextType;
	
	const { setAllChatRooms, setAllInboxes
	} = useContext(AllChatsAndInboxesContext) as AllChatsAndInboxesContextType;
	
	
	const [message, setMessage] = useState("");
	
	const sendFirstMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		if (!message.trim()) {
			return showSwal("the message field is empty", "error", "ok");
		}
		
		const res = await fetch("/api/create/private", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ newChatmate , message })
		})
		
		if (res.status === 201) {
			
			const { newChatRoom, userNewInbox } = await res.json();
			
			setAllChatRooms((prev: (GroupType | PrivateType)[]) => [ newChatRoom, ...prev ]);
			setAllInboxes((prevInboxes: (GroupInbox | PrivateInbox)[]) => [ userNewInbox, ...prevInboxes ]);
			
			socket.emit("createNewChatRoom", newChatRoom);
			
			setRole("USER");
			setChatId(newChatRoom._id);
			setNewChatmate("");
			
		} else if (res.status === 500) {
			showSwal("there was a problem, try again", "error", "ok")
		}
	}
	
	
	return (
		<form
			onSubmit={(e) => sendFirstMessage(e)}
			className="flex my-2"
		>
			<Input
				type="text"
				className="flex-1 mx-2 text-white"
				value={message}
				placeholder="Send the first message..."
				onChange={(e) => setMessage(e.target.value)}
			/>
			<Button
				type="submit"
				className="w-14 bg-primary mr-2 fill-white hover:fill-black hover:bg-white"
			>
				<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
			</Button>
		</form>
	)
}


export default SendFirstMessage;