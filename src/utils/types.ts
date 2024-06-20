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

type CurrentChatContextType = {
	name: string,
	updateName: (name: string) => void,
	role: string,
	updateRole: (role: string) => void,
	chatId: string,
	updateChatId: (chatId: string) => void,
	chatType: string,
	updateChatType: (chatType: string) => void,
	newChatmate: string,
	updateChatmateId: (newChatmateId: string) => void,
}

type MessageType = {
	_id: string,
	body: string,
	createdAt: string,
	sender: {
		_id: string,
		name: string
	} | string,
	isSystemMessage?: boolean
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
CurrentChatContextType,
MessageType,
WebsocketContextType,
SearchResult
};