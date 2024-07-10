"use client"
import { useState, useContext, useEffect } from "react";

import { Avatar, AvatarFallback } from "ui/Avatar";
import { ToggleGroup, ToggleGroupItem } from "ui/ToggleGroup";
import { ScrollArea } from "ui/ScrollArea";
import { Separator } from "ui/Separator";

import { CurrentChatStatusContext } from "c/CurrentChatStatusProvider";
import { WebsocketContext } from "c/WebsocketProvider";
import { AllChatsAndInboxesContext } from "c/AllChatsAndInboxesProvider";


import type {
GroupType,
PrivateType,
CurrentChatStatusContextType,
WebsocketContextType,
AllChatsAndInboxesContextType,
MessageType } from "u/types";

type ContactsParams = {
	userId: string,
	isForDialog: boolean
}



const Contacts = ({ userId, isForDialog }: ContactsParams) => {
	
	const { setName, setRole, setChatId, setChatType, chatId
	} = useContext(CurrentChatStatusContext) as CurrentChatStatusContextType;
	
	const { allChatRooms, setAllChatRooms, chatRoomsWithUnreadMessages
	} = useContext(AllChatsAndInboxesContext) as AllChatsAndInboxesContextType;
	
	
	// chat === room || chatId === roomId
	
	const allChatIds = allChatRooms.map(chat => chat._id);
	// 'allChatIds' includes all the _id of all the chats(conversations) that the user has
	// to be joined in them in order to get the messages of that chat(conversation) through
	// the websocket.
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	useEffect(() => {
		
		const receiveNewMessage = (message: MessageType, roomId: string) => {
			
			const updatedChatRooms = allChatRooms.map(chat => {
				if (chat._id === roomId) {
					return {
						...chat,
						lastMessage: message.body,
						lastMessageDate: message.createdAt
					};
				} else {
					return chat;
				}
			});
		
			const sortedChatRooms = updatedChatRooms.sort((a: any, b: any) => {
				return new Date(b.lastMessageDate).toISOString().localeCompare(new Date(a.lastMessageDate).toISOString())
			});
		
			setAllChatRooms(sortedChatRooms);
		}
		
		
		const receiveNewChatRoom = (chatRoom: GroupType | PrivateType) => {
			// check out Search.tsx and SendFirstMessage.tsx to find out what happens
			// when "chatRoom.type" is 0(private conversation).
			
			if (chatRoom.type === 1) { // "chatRoom.type === 1" is true if the 'chatRoom' is a group chat.
				
				setChatId(chatRoom._id);
				setName(chatRoom.name);
				setChatType("group");
				
				const isAdmin = chatRoom.admins.length > 0 && chatRoom.admins.some(id => id === userId);
				if (isAdmin) {
					setRole("ADMIN");
					
				} else if (userId === chatRoom.owner) {
					setRole("OWNER");
					
				} else {
					setRole("USER");
				}
			}
		}
		
		if (socket) {
			socket.emit("joinUserInThisChatRooms", allChatIds);
			
			socket.on("message", receiveNewMessage);
			socket.on("newChatRoom", receiveNewChatRoom);
		}
		
		return () => {
			socket?.off("message", receiveNewMessage);
			socket?.off("newChatRoom", receiveNewChatRoom);
		};
		
		
	}, [socket, allChatRooms])
	
	
	
	
	
	const findChatmateName = (chatId: string): string => {
		/*
		'allChatRooms' array stores the information of all of the private chats of the user.
		
		in the 'chatId' parameter, the value of _id of a private chat is stored. with the
		help of the chatId parameter, we can find the full information of our private chat from
		the 'allChatRooms' array. which we store that information in the privateChatInfo constant.
		
		privateChatInfo includes the 'chatmates' field. which is an array of objects and
		each object contains the '_id' and 'name' field of one of the chat partners. we have
		the _id of the user(userId), so we can find the other chat partner's object very easily.
		*/
		
		
		const privateChatInfo = allChatRooms.find(privateChat => privateChat._id === chatId) as PrivateType;
		
		const chatPartnerName = privateChatInfo.chatmates.find((chatmate) => chatmate._id !== userId)?.name as string
		return chatPartnerName;
	}
	
	
	
	const selectChat = (chatId: string) => {
		
		setChatId(chatId);
		const chatInfo = allChatRooms.find((chat) => chat._id === chatId) as (GroupType | PrivateType);
		
		// type of an "chat" is 0 if its a private chat. and 1 if its a group chat.
		if (chatInfo.type === 0) {
			setName(findChatmateName(chatId));
			setChatType("private");
			setRole("USER");
		
		} else {
			setName(chatInfo.name);
			setChatType("group");
			
			const isAdmin = chatInfo.admins.length > 0 && chatInfo.admins.some((id) => id === userId);
			if (isAdmin) {
				setRole("ADMIN");
				
			} else if (userId === chatInfo.owner) { // 'owner' === _id of a user
				setRole("OWNER");
				
			} else {
				setRole("USER");
			}
		}
	}
	
	
	
	
	
	
	return (
			<ScrollArea
				className={`${!isForDialog && "hidden md--lg:block md--lg:w-1/4 rounded-xl mr-3"}
				max-w-xs bg-secondary h-full`}
			>
				
				<ToggleGroup
					className="block"
					type="single"
				>
				{/*type of an "chat" is 0 if its a private chat. and 1 if its a group chat.*/}
				{
					allChatRooms.length === 0 ? (
							<div
								className={`text-white text-center px-3 flex items-center justify-center
								${isForDialog ? "h-[80vh]" : "h-[90vh]"}`}
							>
								<p>search for a user or a group...</p>
							</div>
						) : (
						allChatRooms.map((chat : (GroupType | PrivateType)) => (
							<ToggleGroupItem
								key={chat._id}
								value={chat.type === 1 ? chat.name : findChatmateName(chat._id)}
								aria-label={`Toggle ${chat.type === 1 ? chat.name : findChatmateName(chat._id)}`}
								disabled={chatId === chat._id}
								className={`max-h-[300px] w-full justify-start p-2 py-6 rounded-none relative
								${chatId === chat._id && "selected-contact-bg"} hover:bg-primary`}
								onClick={() => selectChat(chat._id)}
							>
								
								<div className="flex justify-start gap-2 items-center text-slate-100">
									
									<Avatar
										className="flex-shrink-0"
									>
										<AvatarFallback className="avatar">
											{ chat.type === 1 ? chat.name[0] :
											findChatmateName(chat._id)[0] }
										</AvatarFallback>
									</Avatar>
									
									<div className="flex flex-col items-start">
										<span className="text-sm">
											{chat.type === 1 ? chat.name : findChatmateName(chat._id)}
										</span>
										<span
											className="text-tiny text-default-400"
										>
											{chat.lastMessage.slice(0, 12)}
										</span>
									</div>
									
								</div>
								{
									chatRoomsWithUnreadMessages.length > 0 && 
									chatRoomsWithUnreadMessages.some(chatRoomId => chatRoomId === chat._id ) && (
										<div className="bg-[#708090] w-2 h-[10px] absolute top-[9px] right-2 rounded-full"></div>
									)
								}
								
							</ToggleGroupItem>
						))
					)
				}
				</ToggleGroup>
				
			</ScrollArea>
	)
}


export default Contacts;