import axios from "axios";


const SERVER_URL = "http://localhost:3002";


export const getAllUsers = () => {
	const url = `${SERVER_URL}/users`;
	
	return axios.get(url);
}


export const createRoom = newRoom => {
	const url = `${SERVER_URL}/rooms`;
	
	return axios.post(url, newRoom);
}


export const createRoomMessages = newRoomMessages => {
	const url = `${SERVER_URL}/messages`;
	
	return axios.post(url, newRoomMessages);
}

