import mongoose from "mongoose";

require("./ChannelMessage");
require("./User");


const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 12,
	},
	id: {
		type: String,
		required: true,
		unique: true,
		index: true,
		minLength: 5,
		maxLength: 15,
	},
	lastMessage: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	admins: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
})

schema.virtual("messages", {
	ref: "ChannelMessage",
	localField: "_id",
	foreignField: "channel"
})

// schema.virtual("members", {
	// ref: "User",
	// localField: "_id",
	// foreignField: "channels"
// })


const model = mongoose.models?.Channel || mongoose.model("Channel", schema);

export default model;
