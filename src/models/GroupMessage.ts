import mongoose from "mongoose";

require("./User");
require("./Group");


const schema = new mongoose.Schema({
	body: {
		type: String,
		required: true,
	},
	sender: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	isSeen: {
		type: Boolean,
		required: true,
	},
	isSystemMessage: Boolean,
	group: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Group",
		required: true,
	}
},
{
	timestamps: true
})

const model = mongoose.models?.GroupMessage || mongoose.model("GroupMessage", schema);

export default model;
