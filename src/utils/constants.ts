const authTypes = {
	LOGIN: "LOGIN",
	REGISTER: "REGISTER",
};

const roles = {
	OWNER: "OWNER",
	ADMIN: "ADMIN",
	USER: "USER",
	OBSERVER: "OBSERVER"
};

const messageTypes = {
	USER: "USER",
	CHATMATE: "CHATMATE",
	SYSTEM: "SYSTEM"
}

const chatTypes = {
	PRIVATE: "PRIVATE",
	GROUP: "GROUP"
}

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#.?^_-]).{8,15}$/g
const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
const idRegex = /^(?=.{5,15}$)(?![0-9])[a-zA-Z0-9_.-]+$/g



// const phoneRegex = /^(0|0098|\+98)9(0[1-5]|[1 3]\d|2[0-2]|98)\d{7}$/g


export {
authTypes,
roles,
messageTypes,
chatTypes,
passwordRegex,
emailRegex,
idRegex
}