import axios from "axios";


const SERVER_URL = "http://localhost:3002";


export const getUser = (userId) => {
	const url = `${SERVER_URL}/users/${userId}`;
	return axios.get(url);
}


export const createUser = (user) => {
	const url = `${SERVER_URL}/users`;
	return axios.post(url, user);
}


export const updateUser = (userId, updatedUser) => {
	const url = `${SERVER_URL}/users/${userId}`;
	return axios.put(url, updatedUser);
}


