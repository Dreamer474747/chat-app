import mongoose from "mongoose";


const connectToDB = async () => {
	
	try {
		
		if (mongoose.connections[0].readyState) {
			return false;
		} else {
			
			await mongoose.connect(`${process.env.MongoDB_URL}/chat-app`, { authSource: "admin" });
			console.log("connected to chat-app DB successfully :))");
		}
		
	} catch(err) {
		console.log("DB connection error =>", err)
	}
	
}


export default connectToDB;