import axios from "axios";


const SERVER_URL = "http://localhost:3002";

export const getAllRooms = () => {
	const url = `${SERVER_URL}/rooms`;
	return axios.get(url);
}

