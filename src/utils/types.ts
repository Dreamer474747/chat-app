import { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

type chatmate = {
	_id: string,
	name: string
}

type PrivateType = {
	_id: string,
	type: 0,
	chatmates: chatmate[],
	lastMessage: string,
	lastMessageDate: string,
}

type GroupType = {
	_id: string,
	type: 1,
	name: string,
	lastMessage: string,
	lastMessageDate: string,
	owner: string,
	admins: string[],
}

type PrivateInbox = {
	private: string,
	lastSeenMessage: string,
}

type GroupInbox = {
	group: string,
	lastSeenMessage: string,
}

type CurrentChatStatusContextType = {
	name: string,
	setName: (name: string) => void,
	role: string,
	setRole: (role: string) => void,
	chatId: string,
	setChatId: (chatId: string) => void,
	chatType: string,
	setChatType: (chatType: string) => void,
	newChatmate: string,
	setNewChatmate: (newChatmateId: string) => void,
}

type AllChatsAndInboxesContextType = {
	allChatRooms: (GroupType | PrivateType)[],
	setAllChatRooms: Dispatch<SetStateAction<any>>,
	allInboxes: (GroupInbox | PrivateInbox)[],
	setAllInboxes: Dispatch<SetStateAction<any>>,
	chatRoomsWithUnreadMessages: string[],
	setChatRoomsWithUnreadMessages: Dispatch<SetStateAction<any>>
}
// change the 'any' type later
// (GroupType | PrivateType)[]
// (GroupInbox | PrivateInbox)[]

type MessageType = {
	_id: string,
	body: string,
	createdAt: string,
	sender: {
		_id: string,
		name: string
	} | string,
	isSystemMessage?: boolean,
	isSeen: boolean
}

type WebsocketContextType = {
	socket: Socket
}

type SearchResult = {
	_id: string,
	id: string,
	name: string
}

export type {
GroupType,
PrivateType,
PrivateInbox,
GroupInbox,
CurrentChatStatusContextType,
AllChatsAndInboxesContextType,
MessageType,
WebsocketContextType,
SearchResult
};