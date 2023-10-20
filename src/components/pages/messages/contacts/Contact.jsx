import { useEffect, useState } from "react";

import { Box, Typography, Avatar, Divider } from "@mui/material";

//import oneTick from "../../../../../public/svgs/oneTick.svg";
//import twoTick from "../../../../../public/svgs/twoTick.svg";
//import twoTickUnseen from "../../../../../public/svgs/twoTickUnseen.svg";

import EllipsisText from "react-ellipsis-text";

import {
useLazyGetChatMessagesQuery,
messagesCollected,
selectLastMessages
} from "../../../../reducers/chatSlice";
import { useLazyGetUserQuery } from "../../../../reducers/authSlice";

import { useDispatch, useSelector } from "react-redux";

import { selectUserInfo } from "../../../../reducers/userInfoSlice";
import { makeContactsFlagFalse } from "../../../../reducers/sidebarSlice";
import { setChatPartnerInfo } from "../../../../reducers/chatPartnerInfoSlice";

import { timeConverter, colorPicker } from "../../../../helpers";

import toast from 'react-hot-toast';








const Contact = ({ chatPairDetails, index }) => {
	
	const dispatch = useDispatch();
	const [getUser] = useLazyGetUserQuery();
	const [getChatMessages] = useLazyGetChatMessagesQuery();
	
	
	const { id: userId } = useSelector(selectUserInfo);
	
	const { id: chatKey, chatPartnersIds } = chatPairDetails;
	
	const [otherChatPartnerName, setOtherChatPartnerName] = useState("");
	
	const otherChatPartnerId = chatPartnersIds.find((id) => id !== userId)
	
	
	
	useEffect(() => {
		
		
		const otherChatPartnerFinder = async () => {
			
			const { data: otherChatPartnerInfo } = await getUser(otherChatPartnerId);
			setOtherChatPartnerName(otherChatPartnerInfo.username)
			// we only get the id the both chat partners and extract the other chat partner but we dont get the
			// name of the other chat partner. thats why we have to get the info of the other chat partner so we
			// can have the name of the other chat partner. change the backEnd some how so we no longer need to 
			// get the info of the other chat partner.
			
		}
		
		otherChatPartnerFinder();
		
	}, [])
	
	
	const chatPartner = {
		chatPartnerName: otherChatPartnerName,
		chatKey,
		chatPartnerId: otherChatPartnerId
	}
	
	
	
	
	
	
	const allLastMessages = useSelector(selectLastMessages);
	
	const lastMessage = allLastMessages.find(lastM => lastM.id === chatKey);
	const { text, time } = lastMessage.lastText;
	
	const formattedDate = timeConverter(time);
	
	
	
	
	
	const messageCollector = async chatPlaceId => {
		const { data: allTheMessagesOfTheCurrentChatAndItsId } = await getChatMessages(chatPlaceId);
		
		dispatch(messagesCollected(allTheMessagesOfTheCurrentChatAndItsId));
	}
	
	
	
	

	
	
	return (
	
		<Box
		sx={{
			width: "100%",
			marginBottom: "0.5rem",
			marginTop: "1rem",
			cursor: "pointer",
		}}
		onClick={() => {
			messageCollector(chatKey)
			dispatch(setChatPartnerInfo(chatPartner))
			dispatch(makeContactsFlagFalse())
		}}
		>
		
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					height: "70px",
					userSelect: "none"
				}}
			>
				
				<Avatar
					alt=""
					src="there-is-no-src"
					sx={{
						width: {xs: "60px", smMd: "70px"},
						height: {xs: "60px", smMd: "70px"},
						fontSize: {xs: "2.4rem", smMd: "2.8rem"},
						bgcolor: colorPicker(index),
						marginRight: "1rem"
					}}
				/>
				
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						flex: 1
					}}
				>
				
					<Box>

						<Typography
							sx={{
								fontSize: "18px",
								fontWeight: 600,
								color: "#fff",
							}}
						>
						
						{otherChatPartnerName}
						
						</Typography>
						
						<Typography
							sx={{
								color: "rgba(255, 255, 255, 0.75)",
								fontFamily: "PoppinsMedium",
								fontSize: "14px"
							}}
						>
						
							<EllipsisText text={text} length={11} />
						
						</Typography>
					
					</Box>
					
					<Box
						sx={{
							textAlign: "right",
							display: {
								xs: "none",
								md: "block",
							}
						}}
					>
					
						<Typography
							sx={{
								fontFamily: "PoppinsMedium",
								fontSize: {xs: "10px", lg: "12px"},
								color: "rgba(255, 255, 255, 0.5)",
								marginLeft: "0.4rem"
							}}
						>
						
						{formattedDate}
						
						</Typography>
						
						{/*<div style={{ marginRight: "0.6rem" }} >
							<img src={twoTick} alt="tick or tick's" />
						</div>*/}
					
					</Box>
					
				
				</Box>
			
			</Box>
			
			<Divider
				sx={{
					marginTop: "1rem",
					marginLeft: {xs: 0, lg: "0.5rem"},
					borderColor: "rgba(255, 255, 255, 0.25)"
				}}
			/>
		
		</Box>
	
	)
}

export default Contact;
