import axios from "axios";


const SERVER_URL = "http://localhost:3002";

export const getRoomMessages = roomId => {
	const url = `${SERVER_URL}/messages/${roomId}`;
	
	return axios.get(url);
}


export const updateRoomMessages = (roomId, updatedRoomMessages) => {
	const url = `${SERVER_URL}/messages/${roomId}`;
	
	return axios.put(url, updatedRoomMessages);
}


export const getRoomInfo = roomId => {
	const url = `${SERVER_URL}/rooms/${roomId}`;
	
	return axios.get(url);
}


export const updateRoomInfo = (roomId, updatedRoomInfo) => {
	const url = `${SERVER_URL}/rooms/${roomId}`;
	
	return axios.put(url, updatedRoomInfo);
}
