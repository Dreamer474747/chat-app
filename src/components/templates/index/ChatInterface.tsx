"use client";
import { useContext, useEffect, useState } from "react";

import { ChatInfo, Messages } from "./chat-interface-subcomps";
import {
SendMessage,
SendFirstMessage,
JoinChat } from "./chat-interface-subcomps/send-message-or-join-chat";

import { CurrentChatStatusContext } from "c/CurrentChatStatusProvider";
import { AllChatsAndInboxesContext } from "c/AllChatsAndInboxesProvider";
import type {
CurrentChatStatusContextType,
AllChatsAndInboxesContextType,
MessageType,
GroupType,
PrivateType,
GroupInbox,
PrivateInbox
} from "u/types";


type ChatInterfaceParams = {
	userId: string,
	userChatRooms: (GroupType | PrivateType)[],
	userInboxes: (GroupInbox | PrivateInbox)[]
}


const ChatInterface = ({ userId, userChatRooms, userInboxes }: ChatInterfaceParams) => {
	
	const { role, newChatmate, chatId, chatType
	} = useContext(CurrentChatStatusContext) as CurrentChatStatusContextType;
	
	const { setAllChatRooms, setAllInboxes, setChatRoomsWithUnreadMessages, allInboxes,
	} = useContext(AllChatsAndInboxesContext) as AllChatsAndInboxesContextType;
	
	useEffect(() => {
		
		setAllChatRooms(userChatRooms);
		setAllInboxes(userInboxes);
	}, [])
	
	useEffect(() => {
		
		const getUnreadChatRooms = async () => {
			
			if (allInboxes.length > 0) {
				
				const res = await fetch("/api/get/unreadChatRooms")
				
				const { allUnreadChatRooms } = await res.json();
				setChatRoomsWithUnreadMessages(allUnreadChatRooms);
			}
		}
		getUnreadChatRooms();
	}, [allInboxes])
	
	
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSeenMessageId, setLastSeenMessageId] = useState("");
	
	useEffect(() => {
		
		const getMessages = async () => {
			
			setIsLoading(true);
			
			const res = await fetch(`/api/get/messages/${chatType}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ chatId })
			})
			
			const data = await res.json();
			setMessages(data.messages);
			setIsLoading(false);
		}
		
		if (chatId) {
			getMessages();
		} else {
			setMessages([]); // dont touch this line of code.
		}
		
	}, [chatId])
	
	
	
	
	let Communication = <SendMessage setLastSeenMessageId={setLastSeenMessageId} />;
	if (role === "OBSERVER") {
		
		if (newChatmate) {
			// 'SendFirstMessage' component is only used for a private chat that has 0 messages.
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
							setMessages={setMessages}
							userId={userId}
							isLoading={isLoading}
							lastSeenMessageId={lastSeenMessageId}
							setLastSeenMessageId={setLastSeenMessageId}
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