"use client"

import { createContext, useState } from "react";

import type { CurrentChatContextType } from "u/types";



export const CurrentChatContext = createContext<CurrentChatContextType | null>(null)


const CurrentChatProvider = ({ children }: { children: React.ReactNode }) => {
	
	// dont read the const below as 'name'. read it as 'Current Chat's name'. for example a
	// group chat's name. or a channel's name. it can also be a private chat's name which is either
	// the user's name or his chat partner's name.
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	// stores the _id of a chat.
	const [chatId, setChatId] = useState("");
	// type of a chat is either "channel", "group" or "private".
	const [chatType, setChatType] = useState("");
	// the const below is only for the time when the user wants to send the first message
	// in a private conversation.
	const [newChatmate, setNewChatmate] = useState("");
	
	const updateName = (name: string) => setName(name);
	const updateRole = (role: string) => setRole(role);
	const updateChatId = (chatId: string) => setChatId(chatId);
	const updateChatType = (chatType: string) => setChatType(chatType);
	const updateChatmateId = (newChatmateId: string) => setNewChatmate(newChatmateId);
	
	
	return (
		<>
		
			<CurrentChatContext.Provider value={{ name, updateName, role, updateRole, chatId, updateChatId,
				chatType, updateChatType, newChatmate, updateChatmateId }}>
				{children}
			</CurrentChatContext.Provider>
		
		</>
	)
}

export default CurrentChatProvider;