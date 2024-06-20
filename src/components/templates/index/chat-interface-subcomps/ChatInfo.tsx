"use client";
import { useContext } from "react";

import { CurrentChatContext } from "c/CurrentChatProvider";
import { CurrentChatContextType } from "u/types";

import { Avatar, AvatarFallback } from "ui/Avatar";



const ChatInfo = () => {
	
	const { name } = useContext(CurrentChatContext) as CurrentChatContextType;
	
	
	return (
		<>
			<div className="flex gap-2 items-center pl-5 py-2 text-white bg-primary rounded-t-xl">
				
				<Avatar>
					<AvatarFallback className="avatar">
						{name[0]}
					</AvatarFallback>
				</Avatar>
				
				<div className="flex flex-col">
					<span className="text-small">{ name }</span>
				{/*	<span      // we add this later
						className="text-tiny text-default-400"
					>
						online
					</span> */}
				</div>
			</div>
		</>
	)
	
}

export default ChatInfo;