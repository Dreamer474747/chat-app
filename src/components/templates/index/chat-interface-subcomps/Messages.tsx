"use client"
import { useEffect, useState, useContext, Dispatch, SetStateAction, useRef, useMemo } from "react";
import { InView } from "react-intersection-observer";

import { CurrentChatStatusContext } from "c/CurrentChatStatusProvider";
import { WebsocketContext } from "c/WebsocketProvider";
import { AllChatsAndInboxesContext } from "c/AllChatsAndInboxesProvider";

import { ScrollArea } from "ui/ScrollArea";
import { UserMsg, PrivateChatPartnerMsg, GroupChatPartnerMsg, SystemMsg } from "m/message";

import { showSwal } from "u/helpers";

import type {
PrivateInbox,
GroupInbox,
PrivateType,
GroupType,
MessageType,
CurrentChatStatusContextType,
WebsocketContextType,
AllChatsAndInboxesContextType
} from "u/types";

type MessagesParams = {
	userId: string,
	messages: MessageType[],
	setMessages: Dispatch<SetStateAction<MessageType[]>>,
	isLoading: boolean,
	lastSeenMessageId: string,
	setLastSeenMessageId: Dispatch<SetStateAction<string>>
}


const Messages = ({ userId, messages, setMessages, isLoading, lastSeenMessageId, setLastSeenMessageId }: MessagesParams) => {
	
	const { chatId, chatType, role } = useContext(CurrentChatStatusContext) as CurrentChatStatusContextType;
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	const { allInboxes, setAllInboxes, allChatRooms } = useContext(AllChatsAndInboxesContext) as any;
	
	const [isScrolled, setIsScrolled] = useState(false);
	const [goToBottom, setGoToBottom] = useState(true);
	const [isThereUnseenMessages, setIsThereUnseenMessages] = useState<null | boolean>(null);
	// here, i needed 3 possible situation.
	// null = "unset" || true = "there is unseen messages" || false = "there is no unseen messages"
	
	const isLastMessage = (messageId: string) => {
		
		const isLast = messages.findIndex(msg => msg._id === messageId) === messages.length - 1
		return isLast;
	}
	
	useEffect(() => {
		
		if (role !== "OBSERVER") {
			
			let lastSeenMessageId = "";
			
			if (chatType === "group") {
				lastSeenMessageId = allInboxes.find((inbox: any) => inbox.group === chatId).lastSeenMessage as string
			} else {
				lastSeenMessageId = allInboxes.find((inbox: any) => inbox.private === chatId).lastSeenMessage as string
			}
			setLastSeenMessageId(lastSeenMessageId);
			
			setIsScrolled(false);
		}
		
		const receiveMessage = (message: MessageType, roomId: string) => {
			
			if (chatId === roomId) {
				
				setMessages((prev: MessageType[]) => [...prev, message]);
			}
		}
		
		
		if (socket) {
			socket.on("message", receiveMessage);
		}
		
		return () => {
			socket?.off("message", receiveMessage);
			setIsThereUnseenMessages(null);
		};
		
	}, [chatId])
	
	
	const lastSeenMessageRef = useRef<HTMLDivElement>(null);
	const endOfMessagesRef = useRef<HTMLDivElement>(null);
	
	useEffect(() => {
		
		if (role === "OBSERVER" && endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({ block: "end", inline: "nearest" });
			
		} else if (isThereUnseenMessages && lastSeenMessageRef.current && !isScrolled) {
			
			lastSeenMessageRef.current.scrollIntoView({ block: "end", inline: "nearest" })
			setIsScrolled(true);
			
		} else if (!isThereUnseenMessages && endOfMessagesRef.current && goToBottom && messages.length) {
			endOfMessagesRef.current.scrollIntoView({ block: "end", inline: "nearest" });
			
		} else if (!goToBottom) {
			setGoToBottom(true);
		}
		
	}, [isThereUnseenMessages, chatId])
	
	
	
	useEffect(() => {
		
		if (messages.length > 0) {
			
			if (role !== "OBSERVER") {
				
				const isLastSeenMsgLastMsg = isLastMessage(lastSeenMessageId);
				
				if (isLastSeenMsgLastMsg) {
					setIsThereUnseenMessages(false);
				} else {
					setIsThereUnseenMessages(true);
				}
			} else if (role === "OBSERVER" && endOfMessagesRef.current) {
				endOfMessagesRef.current.scrollIntoView({ block: "end", inline: "nearest" });
			}
		}
		
		
		const receiveNewSeenMessage = (messageId: string) => {
			
			const updatedMessages = messages.map(message => {
				if (message._id === messageId) {
					return { ...message, isSeen: true }
				} else {
					return message;
				}
			})
			console.log(updatedMessages);
			
			setMessages(updatedMessages);
		}
		
		if (socket) {
			socket.on("newSeenMessage", receiveNewSeenMessage);
		}
		
		return () => {
			socket?.off("newSeenMessage", receiveNewSeenMessage);
		};
		
	}, [messages])
	
	
	const messageWasSeen = (inView: boolean, entry: IntersectionObserverEntry) => {
		
		// if the browser supports window.requestIdleCallback...
		if (window.requestIdleCallback && inView && role !== "OBSERVER") {
			window.requestIdleCallback( async () => {
				
				const messageId = entry.target.id;
				
				const res = await fetch(`/api/seen/${chatType}Message/${messageId}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json"
					}
				})
				
				if (res.status === 200) {
					
					const { isLastMessage } = await res.json();
					
					if (!isLastMessage) {
						setGoToBottom(false);
						return socket.emit("messageIsSeen", messageId, chatId)
					}
					// messageId is a message's _id
					
					if (chatType === "group") {
						
						const updatedInboxIndex = allInboxes.findIndex((inbox: any) => inbox.group === chatId);
						let helper = [...allInboxes];
						
						helper[updatedInboxIndex].lastSeenMessage = messageId;
						setAllInboxes(helper);
						
					} else {
						
						const updatedInboxIndex = allInboxes.findIndex((inbox: any) => inbox.private === chatId);
						let helper = [...allInboxes];
						
						helper[updatedInboxIndex].lastSeenMessage = messageId;
						setAllInboxes(helper);
					}
					socket.emit("messageIsSeen", messageId, chatId);
					
				} else {
					showSwal("there was a problem, is you're internet connected?", "error", "ok");
				}
				
			})
		}
	}
	
	
	let currentChatRoomLastMessage = "";
	if (role !== "OBSERVER") {
		currentChatRoomLastMessage = allChatRooms.find((chatRoom: PrivateType | GroupType) => chatRoom._id === chatId)?.lastMessage as string;
	}
	useEffect(() => {
		if (currentChatRoomLastMessage && endOfMessagesRef.current) {
			endOfMessagesRef.current.scrollIntoView({ block: "end", inline: "nearest" });
		}
		
	}, [currentChatRoomLastMessage])
	
	
	
	return (
		<ScrollArea className="grow flex flex-col px-3">
		
			{
				isLoading ? (
					<p className="text-center mt-4 text-white"> wait a minute... </p>
				) : messages.length === 0 && (
					<p className="text-center mt-4 text-white"> no messages yet... </p>
				)
			}
			
			{
				!isLoading && chatType === "private" && messages.map(message => (
					<InView
						onChange={messageWasSeen}
						threshold={0}
						key={message._id}
					>
						{({ ref }) => (
						
							message._id === lastSeenMessageId && !isLastMessage(message._id) ? (
								<>
									{
										message.sender === userId ? (
											<UserMsg
												body={message.body}
												createdAt={message.createdAt}
												seen={message.isSeen}
											/>
										) : (
											<PrivateChatPartnerMsg
												ref={ref}
												id={message._id}
												body={message.body}
												createdAt={message.createdAt}
												seen={message.isSeen}
											/>
										)
									}
									<div
										ref={lastSeenMessageRef}
										className="mt-2 m-auto w-fit"
									>
										<h5
											className={`text-slate-300 px-4 py-1 border rounded-sm text-xs
											sm:text-base`}
										>
											Unread messages
										</h5>
									</div>
								</>
								
							) : message.sender === userId ? (
								<UserMsg
									body={message.body}
									createdAt={message.createdAt}
									seen={message.isSeen}
								/>
							) : (
								<PrivateChatPartnerMsg
									ref={ref}
									id={message._id}
									body={message.body}
									createdAt={message.createdAt}
									seen={message.isSeen}
								/>
							)
						)}
					</InView>
				))
			}
			
			{
				!isLoading && chatType === "group" && messages.map(message => (
					<InView
						onChange={messageWasSeen}
						threshold={0}
						key={message._id}
					>
						{({ ref }) => (
						
							message._id === lastSeenMessageId && !isLastMessage(message._id) ? (
								<>
									{
										message.isSystemMessage ? (
											<SystemMsg
												body={message.body}
											/>
											
										) : typeof message.sender === "object" && message.sender._id === userId ? (
											<UserMsg
												body={message.body}
												createdAt={message.createdAt}
												seen={message.isSeen}
											/>
										) : (
											<GroupChatPartnerMsg
												id={message._id}
												body={message.body}
												createdAt={message.createdAt}
												name={typeof message.sender === "object" ? message.sender.name : ""}
												seen={message.isSeen}
												ref={ref}
											/>
										)
									}
									<div
										ref={lastSeenMessageRef}
										className="mt-2 m-auto w-fit"
									>
										<h5
											className={`text-slate-300 px-4 py-1 border rounded-sm text-xs
											sm:text-base`}
										>
											Unread messages
										</h5>
									</div>
								</>
								
							) : message.isSystemMessage ? (
								<SystemMsg
									body={message.body}
								/>
								
							) : typeof message.sender === "object" && message.sender._id === userId ? (
								<UserMsg
									body={message.body}
									createdAt={message.createdAt}
									seen={message.isSeen}
								/>
							) : (
								<GroupChatPartnerMsg
									id={message._id}
									body={message.body}
									createdAt={message.createdAt}
									name={typeof message.sender === "object" ? message.sender.name : ""}
									seen={message.isSeen}
									ref={ref}
								/>
							)
						)}
					</InView>
				))
			}
			
			<div ref={endOfMessagesRef}></div>
			
		</ScrollArea>
	)
}


export default Messages;