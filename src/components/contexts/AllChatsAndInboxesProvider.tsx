"use client"

import { createContext, useState } from "react";

import type { AllChatsAndInboxesContextType } from "u/types";



export const AllChatsAndInboxesContext = createContext<AllChatsAndInboxesContextType | null>(null)


const AllChatsAndInboxesProvider = ({ children }: { children: React.ReactNode }) => {
	
	const [allChatRooms, setAllChatRooms] = useState([]);
	const [allInboxes, setAllInboxes] = useState([]);
	const [chatRoomsWithUnreadMessages, setChatRoomsWithUnreadMessages] = useState([]);
	
	return (
		<AllChatsAndInboxesContext.Provider
			value={{ allChatRooms, setAllChatRooms, allInboxes, setAllInboxes,
			chatRoomsWithUnreadMessages, setChatRoomsWithUnreadMessages }}
		>
			{children}
		</AllChatsAndInboxesContext.Provider>
	)
}

export default AllChatsAndInboxesProvider;