import mongoose from "mongoose";


const connectToDB = async () => {
	
	try {
		
		if (mongoose.connections[0].readyState) {
			return false;
		} else {
			
			await mongoose.connect("mongodb://127.0.0.1:27017/chat-app");
			console.log("connected to chat-app DB successfully :))");
		}
		
	} catch(err) {
		console.log("DB connection error =>", err)
	}
	
}


export default connectToDB;