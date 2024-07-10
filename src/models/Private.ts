import mongoose from "mongoose";

require("./PrivateMessage");
require("./User");


const schema = new mongoose.Schema({
	type: {
		type: Number,
		default: 0
	},
	chatmates: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	lastMessage: {
		type: String,
		required: true,
	},
	lastMessageDate: {
		type: Date,
		required: true,
	},
})


const model = mongoose.models?.Private || mongoose.model("Private", schema);

export default model;
