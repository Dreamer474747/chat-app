"use client"
import { useState, useContext, useEffect } from "react";

import { Avatar, AvatarFallback } from "ui/Avatar";
import { ToggleGroup, ToggleGroupItem } from "ui/ToggleGroup";
import { ScrollArea } from "ui/ScrollArea";
import { Separator } from "ui/Separator";

import { CurrentChatContext } from "c/CurrentChatProvider";
import { WebsocketContext } from "c/WebsocketProvider";



import type {
GroupType,
PrivateType,
CurrentChatContextType,
WebsocketContextType,
MessageType } from "u/types";

type ContactsParams = {
	sortedInboxes: (GroupType | PrivateType)[],
	userId: string,
	isForDialog: boolean
}





const Contacts = ({ sortedInboxes, userId, isForDialog }: ContactsParams) => {
	
	const { updateName, updateRole, updateChatId, updateChatType, updateChatmateId, chatId
	} = useContext(CurrentChatContext) as CurrentChatContextType;
	
	const [allInboxes, setAllInboxes] = useState<(GroupType | PrivateType)[]>(sortedInboxes);
	
	// chat === room || chatId === roomId
	
	const allInboxIds = allInboxes.map(inbox => inbox._id);
	// 'allInboxIds' includes all the _id of all the chats(conversations) that the user has
	// to be joined in them in order to get the messages of that chat(conversations) through
	// the websocket.
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	
	useEffect(() => {
		
		const receiveMessage = (message: MessageType, roomId: string) => {
			
			const updatedInboxes = allInboxes.map(inbox => {
				if (inbox._id === roomId) {
					return {
						...inbox,
						lastMessage: message.body,
						lastMessageDate: message.createdAt
					};
				} else {
					return inbox;
				}
			});
		
			const sortedInboxes = updatedInboxes.sort((a: any, b: any) => {
				return new Date(b.lastMessageDate).toISOString().localeCompare(new Date(a.lastMessageDate).toISOString())
			});
		
			setAllInboxes(sortedInboxes);
		}
		
		
		const receiveInbox = (inbox: GroupType | PrivateType) => {
			
			setAllInboxes(prev => [ inbox, ...prev ]);
			
			
			if (inbox.type === 1) { // "inbox.type === 1" is true if the 'newInbox' is a group chat.
				
				updateChatId(inbox._id);
				updateName(inbox.name);
				updateChatType("group");
				
				const isAdmin = inbox.admins.length > 0 && inbox.admins.some((id) => id === userId);
				if (isAdmin) {
					updateRole("ADMIN");
					
				} else if (userId === inbox.owner) {
					updateRole("OWNER");
					
				} else {
					updateRole("USER");
				}
			}
		}
		
		if (socket) {
			socket.emit("joinUserInThisRooms", allInboxIds);
			
			socket.on("message", receiveMessage);
			socket.on("newInbox", receiveInbox);
		}
		
		return () => {
			socket?.off("newInbox", receiveInbox);
			socket?.off("message", receiveMessage);
		};
		
		
	}, [socket, allInboxes])
	
	
	
	
	
	const findChatmateName = (chatId: string): string => {
		/*
		'allInboxes' array stores the information of all of the private chats of the user.
		
		in the 'chatId' parameter, the value of _id of a private inbox is stored. with the help of the
		chatId parameter, we can find the full information of our private chat from the 'allInboxes' array.
		which we store that information in the privateChatInfo constant.
		
		privateChatInfo includes the 'chatmates' field. which is an array of objects and
		each object contains the '_id' and 'name' field of one of the chat partners. we have
		the _id of the user(userId), so we can find the other chat partner's object very easily.
		*/
		
		
		const privateChatInfo = allInboxes.find(privateChat => privateChat._id === chatId) as PrivateType;
		
		const chatPartnerName = privateChatInfo.chatmates.find((chatmate) => chatmate._id !== userId)?.name as string
		return chatPartnerName;
	}
	
	
	
	const selectChat = (chatId: string) => {
		
		updateChatId(chatId);
		const chatInfo = allInboxes.find((inbox) => inbox._id === chatId) as (GroupType | PrivateType);
		
		// type of an "inbox" is 0 if its a private chat. and 1 if its a group chat.
		if (chatInfo.type === 0) {
			updateName(findChatmateName(chatId));
			updateChatType("private");
			updateRole("USER");
		
		} else {
			updateName(chatInfo.name);
			updateChatType("group");
			
			const isAdmin = chatInfo.admins.length > 0 && chatInfo.admins.some((id) => id === userId);
			if (isAdmin) {
				updateRole("ADMIN");
				
			} else if (userId === chatInfo.owner) { // 'owner' === _id of a user
				updateRole("OWNER");
				
			} else {
				updateRole("USER");
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
				{/*type of an "inbox" is 0 if its a private chat. and 1 if its a group chat.*/}
				{
					allInboxes.map((inbox : (GroupType | PrivateType)) => (
						<ToggleGroupItem
							key={inbox._id}
							value={inbox.type === 1 ? inbox.name : findChatmateName(inbox._id)}
							aria-label={`Toggle ${inbox.type === 1 ? inbox.name : findChatmateName(inbox._id)}`}
							disabled={chatId === inbox._id}
							className={`max-h-[300px] w-full justify-start p-2 py-6 rounded-none
							${chatId === inbox._id && "c-blue-bg"} hover:bg-primary`}
							onClick={() => selectChat(inbox._id)}
						>
							
							<div className="flex justify-start gap-2 items-center text-slate-100">
								
								<Avatar
									className="flex-shrink-0"
								>
									<AvatarFallback className="avatar">
										{ inbox.type === 1 ? inbox.name[0] :
										findChatmateName(inbox._id)[0] }
									</AvatarFallback>
								</Avatar>
								
								<div className="flex flex-col items-start">
									<span className="text-sm">
										{inbox.type === 1 ? inbox.name : findChatmateName(inbox._id)}
									</span>
									<span
										className="text-tiny text-default-400"
									>
										{inbox.lastMessage.slice(0, 12)}
									</span>
								</div>
							</div>
							
						</ToggleGroupItem>
					))
				}
				</ToggleGroup>
				
			</ScrollArea>
	)
}


export default Contacts;