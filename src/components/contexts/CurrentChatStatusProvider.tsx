"use client"

import { createContext, useState } from "react";

import type { CurrentChatStatusContextType } from "u/types";



export const CurrentChatStatusContext = createContext<CurrentChatStatusContextType | null>(null)


const CurrentChatStatusProvider = ({ children }: { children: React.ReactNode }) => {
	
	// dont read the const below as 'name'. read it as 'Current Chat's name'. for example a
	// group chat's name. it can also be a private chat's name which is either
	// the user's name or his chat partner's name.
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	// stores the _id of a chat.
	const [chatId, setChatId] = useState("");
	// type of a chat is either "group" or "private".
	const [chatType, setChatType] = useState("");
	// the const below is only for the time when the user wants to send the first message
	// in a private conversation.
	const [newChatmate, setNewChatmate] = useState("");
	
	
	
	return (
		<>
			<CurrentChatStatusContext.Provider value={{ name, setName, role, setRole, chatId,
				setChatId, chatType, setChatType, newChatmate, setNewChatmate }}>
				{children}
			</CurrentChatStatusContext.Provider>
		</>
	)
}

export default CurrentChatStatusProvider;