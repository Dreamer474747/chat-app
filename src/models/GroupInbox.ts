import mongoose from "mongoose";

require("./User");
require("./Group");
require("./GroupMessage");


const schema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
		required: true,
	},
	lastSeenMessage: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "GroupMessage",
		required: true,
	}
})



const model = mongoose.models?.GroupInbox || mongoose.model("GroupInbox", schema);

export default model;
