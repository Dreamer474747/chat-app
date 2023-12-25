import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;


const app = express();

const expressServer = app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
})


const io = new Server(expressServer, {
	cors: {
		origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5173", "http://127.0.0.1:5173"]
	}
})




const allConnectedUsers = [];


io.on("connection", socket => {
	
	const userIdAbbreviated = (socket.id).slice(0, 7);
	
	//socket.join("theRoom");
	
	console.log(socket.id);
	//console.log(socket.rooms);
	//console.log(socket.handshake.time)
	console.log(`user ${userIdAbbreviated} connected.`)
	
	/* when ever the LoginForm component mounts, we have to make sure that the socket that just entered the "/login" route,
	is not in the allConnectedUsers array.
	
	imagine this: the user was in the "/rooms" route, and than he decides to go to the previous route. so he clicks
	the arrow that is in the top left corner of his browser, and goes to the previous
	route(which can be "/login" or just "/". we imagine that its "/login" in this example).
	
	now if the id of the user is not deleted from the allConnectedUsers array, he can not login in the app anymore. because
	his id is still in the allConnectedUsers array. and it has not been deleted. so we find it and delete it.
	
	we also make the value of the userData state empty so the user has to login again. this is not related to here but i just
	thought its better to mention it here. also i will explain why we have to make the value of the userData state empty
	in the LoginForm component. */
	
	
	socket.on("loginFormDisplayed", socketId => {
		const isUserLoggedInIndex = allConnectedUsers.findIndex(user => user.socketId === socketId);
		
		console.log(allConnectedUsers);
		
		if (isUserLoggedInIndex !== -1) {
			allConnectedUsers.splice(isUserLoggedInIndex, 1);
			console.log("hey how are you?")
		}
		
		console.log(allConnectedUsers);
		console.log("idk tbh")
	})
	
	
	socket.on("login", (id, socketId) => {
		
		// first we see if the user that tryes to login, is already logged in or not.
		// all of the logged in users are listed in the allConnectedUsers array.
		const isUserLoggedIn = allConnectedUsers.find(user => user.id === id);
		
		if (isUserLoggedIn) {
			socket.emit("alreadyLoggedIn");
			console.log(allConnectedUsers);
		} else {
			const user = {
				id,
				socketId
			}
			allConnectedUsers.push(user);
			
			socket.emit("userCanLogin")
		}
		
		//console.log(allConnectedUsers);
	})
	
	
	socket.on("joinUserInThisRooms", userRooms => {
		
		for (let i = 0; i < userRooms.length; i++) {
			socket.join(userRooms[i].id);
		}
		console.log(socket.rooms);
	})
	
	
	socket.on("message", (room, message, updatedRoomInfo) => {
		
		socket.to(room).emit("message", room, message, updatedRoomInfo);
	})
	
	
	
	
	
	
	
	
	
	
	socket.on("disconnect", () => {	
		console.log(`user ${userIdAbbreviated} disconnected`);
		
		// when a user is disconnected(which means the user closed the tab), we have to delete the user from
		// the allConnectedUsers array. if we dont do that, the id of the disconnected user will stay in the
		// the allConnectedUsers array and that disconnected user will no longer be able to login in the app.
		
		const disconnectedUserIndex = allConnectedUsers.findIndex(user => user.socketId === socket.id)
		
		if (disconnectedUserIndex !== -1) {
			allConnectedUsers.splice(disconnectedUserIndex, 1);
		}
	})
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	// only to the user that entered the room
	//socket.emit("message", {message:`wellcome to the chat app user ${userIdAbbreviated}`, socketId: "ADMIN"})
	
	// to all other users(not including the user that entered the room)
	//socket.broadcast.emit("message", {message:`user ${userIdAbbreviated} entered the room`, socketId: "ADMIN"})
	
	//socket.on("message", message => {
	//	// to all users(including the user that sended the message) that are in the theRoom room.
	//	io.to("theRoom").emit("message", message);
	//	console.log(message);
	//})
	
	// to all other users(not including the user that leaved the room)
	//socket.on("disconnect", () => {
	//	socket.broadcast.emit("message", {message:`user ${userIdAbbreviated} left the room`, socketId: "ADMIN"});
	//	
	//	console.log(`user ${userIdAbbreviated} disconnected`);
	//})
	
})
