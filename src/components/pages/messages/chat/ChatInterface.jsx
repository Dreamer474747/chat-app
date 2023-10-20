import { useEffect, useRef } from "react";

import { Box, Typography } from "@mui/material";

import UserMessage from "./chatMessage/UserMessage";
import ChatPartnerMessage from "./chatMessage/ChatPartnerMessage";

import { useSelector, useDispatch } from "react-redux";

import {
selectCollectedMessages,
useLazyGetChatMessagesQuery,
messagesCollected,
lastMessagesCollected,
selectLastMessages
} from "../../../../reducers/chatSlice";

import { selectUserInfo } from "../../../../reducers/userInfoSlice";

import { selectChatPartnerInfo } from "../../../../reducers/chatPartnerInfoSlice";

import { lastMessagesUpdater } from "../../../../helpers";









const ChatInterface = () => {
	
	const dispatch = useDispatch();
	
	const allLastMessages = useSelector(selectLastMessages);
	let { messages: allCurrentMessages } = useSelector(selectCollectedMessages);
	
	
	const { id: userId } = useSelector(selectUserInfo);
	
	//Array.isArray(allCurrentMessages) is to determine whether the allCurrentMessages variable is populated with value or not.
	
	
	const { chatKey: currentChatChatKey } = useSelector(selectChatPartnerInfo);
	const [getChatMessages] = useLazyGetChatMessagesQuery();
	
	
	useEffect(() => {
		
		let messageUpdaterTimer;
		
		if (currentChatChatKey) {
			
			messageUpdaterTimer = setInterval(async () => {
				
				const { data: allMessagesAndTheirId } = await getChatMessages(currentChatChatKey);
				dispatch(messagesCollected(allMessagesAndTheirId));
				
				
				const allLastMessagesUpdated = lastMessagesUpdater(currentChatChatKey, allMessagesAndTheirId, allLastMessages);
				
				dispatch(lastMessagesCollected(allLastMessagesUpdated))
				
			}, 10000)
		}
		
		
		return () => clearInterval(messageUpdaterTimer);
		
	
	}, [currentChatChatKey])
	
	
	const chatContactRef = useRef(null);
	
	useEffect(() => {
		chatContactRef.current.scrollTop = chatContactRef.current.scrollHeight;
	}, [allCurrentMessages])
	
	
	
	
	return (
			<Box
			sx={{
				flex: 1,
				display: "flex",
				flexDirection: "column",
				padding: "0 0.75rem",
				overflowY: "scroll",
			}}
			ref={chatContactRef}
			>
			
			{
				Array.isArray(allCurrentMessages)? allCurrentMessages.map((msg, index) => (
					msg.senderId === userId? (<UserMessage msgId={msg.id} time={msg.time} key={index}> {msg.text} </UserMessage>) :
					(<ChatPartnerMessage msgId={msg.id} time={msg.time} key={index}> {msg.text} </ChatPartnerMessage>)
				)) :
				(
					<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 1
					}}
					>
						<Typography
						sx={{
							color: "#fff",
							fontSize: {xs: "10px", sm: "14px", smMd: "1rem", lg: "1.5rem"}
						}}
						>
							Choose a chat and start chatting!
						</Typography>
					</Box>
				)
			}
			
			</Box>
	
	)
}

export default ChatInterface;









