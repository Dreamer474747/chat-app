"use client";
import { useContext, useEffect, useState } from "react";

import { ChatInfo, Messages } from "./chat-interface-subcomps";
import {
SendMessage,
SendFirstMessage,
JoinChat } from "./chat-interface-subcomps/send-message-or-join-chat";

import { CurrentChatContext } from "c/CurrentChatProvider";
import type { CurrentChatContextType, MessageType } from "u/types";




const ChatInterface = ({ userId }: { userId: string }) => {
	
	const { role, newChatmate, chatId, chatType } = useContext(CurrentChatContext) as CurrentChatContextType;
	const [messages, setMessages] = useState<MessageType[]>([]);
	
	useEffect(() => {
		
		const getMessages = async () => {
			
			const res = await fetch(`/api/get/messages/${chatType}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ chatId })
			})
			
			const data = await res.json();
			setMessages(data.messages);
		}
		
		if (chatId) {
			getMessages();
		} else {
			setMessages([]); // dont touch this line of code.
		}
		
	}, [chatId])
	
	
	
	
	let Communication = <SendMessage setMessages={setMessages} />;
	if (role === "OBSERVER") {
		
		if (newChatmate) {
			// 'SendFirstMessage' component is only used for private chats that have 0 messages.
			Communication = <SendFirstMessage />
		} else {
			Communication = <JoinChat />
		}
		
	}
	
	// if user has a role, that means he has selected a chat, therefore we can show him some stuff.
	return (
		<div
			className="w-full md--lg:w-3/4 bg-secondary rounded-xl flex flex-col"
		>
			{
				role ? (
					<>
						<ChatInfo />
						
						<Messages
							messages={messages}
							userId={userId}
							setMessages={setMessages}
						/>
						
						{ Communication }
					</>
				) : (
					<div className="m-auto text-white">
						<h3>choose a chat please...</h3>
					</div>
				)
			}
		</div>
	)
}

export default ChatInterface;