"use client";
import { useState } from "react";

import { Contacts } from "t/index";

import { Button } from "ui/Button";
import {
Popover,
PopoverTrigger,
PopoverContent
} from "ui/Popover";
import { X } from "lucide-react"



import type { GroupType, PrivateType } from "u/types";

type ContactsSheetParams = {
	sortedInboxes: (GroupType | PrivateType)[],
	userId: string
}


const ContactsDialog = ({ sortedInboxes, userId }: ContactsSheetParams) => {
	
	const [open, setOpen] = useState(false);
	
	return (
		<Popover open={open} onOpenChange={setOpen}>
			
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className="fill-white bg-primary hover:bg-primary-hover"
				>
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M160-40v-80h640v80H160Zm0-800v-80h640v80H160Zm320 400q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm70-80q45-56 109-88t141-32q77 0 141 32t109 88h70v-480H160v480h70Zm118 0h264q-29-20-62.5-30T480-280q-36 0-69.5 10T348-240Zm132-280q-17 0-28.5-11.5T440-560q0-17 11.5-28.5T480-600q17 0 28.5 11.5T520-560q0 17-11.5 28.5T480-520Zm0 40Z"/></svg>
				</Button>
			</PopoverTrigger>
			
			<PopoverContent
				className="bg-secondary text-white custom-height2 px-0 py-1 mt-0 mb-[6px] ml-2 sm:ml-0 relative"
			>
				<Button
					className="absolute top-2 right-3 z-10 p-3 bg-primary hover:bg-primary-hover"
					onClick={() => setOpen(false)}
				>
					<X className="h-4 w-4" />
				</Button>
				
				<Contacts sortedInboxes={sortedInboxes} userId={userId} isForDialog={true} />
			</PopoverContent>
			
		</Popover>
	)
}

export default ContactsDialog;