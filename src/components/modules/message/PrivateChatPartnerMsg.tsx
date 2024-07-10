"use client"
import { useRef, useEffect, forwardRef } from "react";

import { Tick, DoubleTick } from "m/icons";

type OptionsType = {
	hour: "2-digit" | "numeric" | undefined,
	minute: "2-digit" | "numeric" | undefined,
	hour12: boolean,
}

type MessageParamsType = {
	body: string,
	createdAt: string,
	seen: boolean,
	id?: string
}

type PrivateChatPartnerMsgProps = MessageParamsType & {
	ref: React.RefObject<HTMLDivElement>;
};


const PrivateChatPartnerMsg = forwardRef<HTMLDivElement, PrivateChatPartnerMsgProps>(
	({ body, createdAt, seen, id }, ref) => {
	
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
				className="w-full flex justify-start relative mt-2 pl-2"
			>
            
				<div
					className={`bg-receivedMessage rounded-[10px] max-w-md
					py-2 px-4 sm:py-3 sm:px-5 relative`}
				>
				
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
					className={`absolute w-0 h-0 bottom-0 left-0 border-[10px] border-solid
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


export default PrivateChatPartnerMsg;