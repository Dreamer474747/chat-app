const lastMessagesUpdater = (currentChatChatKey, allMessagesAndTheirId, allLastMessages) => {
	
	const LastMessageIndex = allMessagesAndTheirId.messages.length - 1;
	//the index of the last message of the conversation which we are currently at.
	
	const currentChatLastMessageIndex = allLastMessages.findIndex(item => item.id === currentChatChatKey)
	//the index of the object that has the properties of the last message of the current conversation.
	//look at the * comment in the end of this file to see an example of what im talking about.
	
	const newAllLastMessages = [...allLastMessages]
	
	newAllLastMessages[currentChatLastMessageIndex] = {
		...newAllLastMessages[currentChatLastMessageIndex],
		lastText: allMessagesAndTheirId.messages[LastMessageIndex]
	};
	
	
	return newAllLastMessages;
	
}

export default lastMessagesUpdater;









////////*////////

//{
//	"id": "3h58hpt",
//	"chatPartnersIds": [
//		"dreamer2",
//		"dreamer"
//	],
//	"lastText": {
//		"id": 13,
//		"senderId": "dreamer2",
//		"senderUsername": "mobinTat",
//		"isSeen": true,
//		"text": "helllloooooo",
//		"time": "2023-10-10T17:37:14.159Z"
//	}
//}

////////*////////