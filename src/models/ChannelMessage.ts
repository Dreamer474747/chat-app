import mongoose from "mongoose";

require("./User");
require("./Channel");


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
	channel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Channel",
		required: true,
	}
},
{
	timestamps: true
})

const model = mongoose.models?.ChannelMessage || mongoose.model("ChannelMessage", schema);

export default model;
