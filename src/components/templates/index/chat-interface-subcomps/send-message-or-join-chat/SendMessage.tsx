"use client";
import { useContext, useState, useEffect, Dispatch, SetStateAction } from "react";

import { CurrentChatContext } from "c/CurrentChatProvider";
import { WebsocketContext } from "c/WebsocketProvider";

import { Button } from "ui/Button";
import { Input } from "ui/Input";

import type { CurrentChatContextType, MessageType, WebsocketContextType } from "u/types";

import { showSwal } from "u/helpers";


type SendMessageParams = {
	setMessages: Dispatch<SetStateAction<MessageType[]>>
}


const SendMessage = ({ setMessages }: SendMessageParams) => {
	
	const { chatId, chatType } = useContext(CurrentChatContext) as CurrentChatContextType;
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	const [message, setMessage] = useState("");
	
	
	const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		
		if (!message.trim()) {
			return showSwal("the message field is empty", "error", "ok");
		}
		
		
		const res = await fetch(`/api/create/message/${chatType}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ body: message, chatId })
		})
		
		const { lastMessage } = await res.json();
		
		if (res.status === 201) {
			socket.emit("message", lastMessage, chatId);
			
			setMessage("");
		
		} else {
			showSwal("there was a problem, try again", "error", "ok")
		}
	}
	
	return (
		<form
			onSubmit={(e) => sendMessage(e)}
			className="flex my-2"
		>
			<Input
				type="text"
				className="flex-1 mx-2 text-white"
				value={message}
				placeholder="Message..."
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

export default SendMessage;