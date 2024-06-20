"use client"
import { useEffect, useContext, Dispatch, SetStateAction, useRef } from "react";

import { CurrentChatContext } from "c/CurrentChatProvider";
import { WebsocketContext } from "c/WebsocketProvider";

import { ScrollArea } from "ui/ScrollArea";
import { UserMsg, PrivateChatPartnerMsg, GroupChatPartnerMsg, SystemMsg } from "m/message";



import type { MessageType, CurrentChatContextType, WebsocketContextType } from "u/types";
type MessagesParams = {
	userId: string,
	messages: MessageType[],
	setMessages: Dispatch<SetStateAction<MessageType[]>>
}


const Messages = ({ userId, messages, setMessages }: MessagesParams) => {
	
	const { chatId, chatType } = useContext(CurrentChatContext) as CurrentChatContextType;
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	
	useEffect(() => {
		
		const receiveMessage = (message: MessageType, roomId: string) => {
			
			if (chatId === roomId) {
				setMessages((prev: MessageType[]) => [...prev, message])
			}
		}
		
		if (socket) {
			socket.on("message", receiveMessage);
		}
		
		return () => {
			socket?.off("message", receiveMessage);
		};
		
	}, [chatId])
	
	
	const chatRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		
		if (chatRef.current) {
			
			chatRef.current?.scrollIntoView();
		}
		
	}, [messages])
	
	
	return (
		<ScrollArea id="ScrollArea" className="grow flex flex-col px-3">
		
			{
				messages.length === 0 && <div className="m-auto text-white"> no messages yet... </div>
			}
			
			{
				chatType === "private" && messages.map((message) => (
					message.sender === userId ? (
						<UserMsg
							key={message._id}
							body={message.body}
							createdAt={message.createdAt}
						/>
					) : (
						<PrivateChatPartnerMsg
							key={message._id}
							body={message.body}
							createdAt={message.createdAt}
						/>
					)
				))
			}
			
			{
				chatType === "group" && messages.map((message) => (
					message.isSystemMessage ? (
						<SystemMsg
							key={message._id}
							body={message.body}
						/>
					) : typeof message.sender === "object" && message.sender._id === userId ? (
						<UserMsg
							key={message._id}
							body={message.body}
							createdAt={message.createdAt}
						/>
					) : (
						<GroupChatPartnerMsg
							key={message._id}
							body={message.body}
							createdAt={message.createdAt}
							name={typeof message.sender === "object" ? message.sender.name : ""}
						/>
					)
				))
			}
			<div ref={chatRef}></div>
			
		</ScrollArea>
	)
}


export default Messages;