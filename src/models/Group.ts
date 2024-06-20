import mongoose from "mongoose";

require("./GroupMessage");
require("./User");


const schema = new mongoose.Schema({
	type: {
		type: Number,
		default: 1
	},
	name: {
		type: String,
		required: true,
		maxLength: 12,
	},
	id: {
		type: String,
		required: true,
		minLength: 5,
		maxLength: 15,
	},
	lastMessage: {
		type: String,
		required: true,
	},
	lastMessageDate: {
		type: Date,
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
	ref: "GroupMessage",
	localField: "_id",
	foreignField: "group"
})


const model = mongoose.models?.Group || mongoose.model("Group", schema);

export default model;
