import mongoose from "mongoose";

require("./User");
require("./Private");


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
	private: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Private",
		required: true,
	}
},
{
	timestamps: true
})

const model = mongoose.models?.PrivateMessage || mongoose.model("PrivateMessage", schema);

export default model;
