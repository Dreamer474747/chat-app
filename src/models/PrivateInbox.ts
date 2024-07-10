import mongoose from "mongoose";

require("./User");
require("./Private");
require("./PrivateMessage");


const schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	private: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Private",
		required: true,
	},
	lastSeenMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "PrivateMessage",
		required: true,
	}
})



const model = mongoose.models?.PrivateInbox || mongoose.model("PrivateInbox", schema);

export default model;
