"use client"
import { useRef, useEffect, forwardRef } from "react";

import { Avatar, AvatarFallback } from "ui/Avatar";
import { Tick, DoubleTick } from "m/icons";

type OptionsType = {
	hour: "2-digit" | "numeric" | undefined,
	minute: "2-digit" | "numeric" | undefined,
	hour12: boolean,
}

type MessageParamsType = {
	body: string,
	createdAt: string,
	name: string,
	seen: boolean,
	id?: string
}

type PrivateChatPartnerMsgProps = MessageParamsType & {
	ref: React.RefObject<HTMLDivElement>;
};



const GroupChatPartnerMsg = forwardRef<HTMLDivElement, PrivateChatPartnerMsgProps>(
	({ body, createdAt, name, seen, id }, ref) => {
	
	const options: OptionsType = {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}
	
	
	
	
	
	return (
		<>
			<div
				ref={seen ? null : ref}
				id={id ? id : ""}
				className="w-full flex justify-start items-end relative mt-2 pl-2"
			>
				
				<Avatar
					className="flex-shrink-0 mr-2"
				>
					<AvatarFallback className="bg-receivedMessage text-white">
						{name[0]}
					</AvatarFallback>
				</Avatar>
				
				<div
					className="bg-receivedMessage rounded-[10px] max-w-md pb-2 pt-5 pl-4 pr-8 relative"
				>
					<p className="text-black text-[10px] absolute top-0 left-2">{name}</p>
					<p
						className="text-white font-PoppinsMedium text-xs sm:text-base"
					>
						{body}
					</p>
					
					<div className="absolute -bottom-0.5 right-0.5">
						{ seen ? <DoubleTick /> : <Tick /> }
					</div>
					
				</div>

				<div
					className={`absolute w-0 h-0 bottom-0 left-12 border-[10px] border-solid
					border-transparent border-t-receivedMessage rotate-180 rounded`}
				></div>
				
			</div>
			<p
				className="text-xs w-full mt-2 font-PoppinsMedium text-white/25"
			>
				{new Intl.DateTimeFormat("en-IR", options).format(new Date(createdAt))}
			</p>
		</>
	)
})





export default GroupChatPartnerMsg;