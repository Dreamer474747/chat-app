type MessageParamsType = {
	body: string,
	createdAt: string
}

type OptionsType = {
	hour: "2-digit" | "numeric" | undefined,
	minute: "2-digit" | "numeric" | undefined,
	hour12: boolean,
}


const UserMessage = ({ body, createdAt }: MessageParamsType) => {
	
	
	const options: OptionsType = {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}
	
	
	return (
		<>
			<div
				className="w-full flex justify-end relative mt-2 pr-2"
			>
            
				<div
					className="bg-sentMessage rounded-[10px] max-w-md py-2 px-4 sm:py-3 sm:px-5"
				>
				
					<p
						className="text-white font-PoppinsMedium text-xs sm:text-base"
					>
						{body}
					</p>
				
				</div>

				<div
					className={`absolute w-0 h-0 bottom-0 right-0 border-[10px] border-solid
					border-transparent border-t-sentMessage rotate-180 rounded`}
				></div>

			</div>
			<p
				className="text-xs w-full mt-2 font-PoppinsMedium text-white/25 text-right"
			>
				{new Intl.DateTimeFormat("en-IR", options).format(new Date(createdAt))}
			</p>
		</>
	)
}


export default UserMessage;