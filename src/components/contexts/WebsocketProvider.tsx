"use client";
import { createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

import type { WebsocketContextType } from "u/types";




const useSocket = () => {
	
	const [socket, setSocket] = useState<any>(null);
	
	useEffect(() => {
		
		const socketIo = io("https://chat-app-websocket-logic.liara.run");
		setSocket(socketIo);
		
		const cleanUp = () => {
			socketIo.disconnect();
		}
		return cleanUp;
		
	}, [])
	
	return socket;
}

export const WebsocketContext = createContext<WebsocketContextType | null>(null);

const WebsocketProvider = ({ children }: { children: React.ReactNode }) => {
	
	const socket = useSocket();
	
	
	return (
		<>
			<WebsocketContext.Provider value={{ socket }}>
				{children}
			</WebsocketContext.Provider>
		</>
	)
}

export default WebsocketProvider;