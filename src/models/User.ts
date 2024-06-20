import mongoose from "mongoose";

require("./Channel");
require("./Group");
require("./Private");


const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		maxLength: 15,
	},
	email: {
		type: String,
		required: true,
	},
	id: {
		type: String,
		required: true,
		minLength: 5,
		maxLength: 15,
	},
	password: {
		type: String,
		required: true,
	},
	refreshToken: {
		type: String,
		required: true,
	},
	channels: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Channel",
			},
		],
	},
	groups: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Group",
			},
		],
	},
	privates: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Private",
			},
		],
	},
})


const model = mongoose.models?.User || mongoose.model("User", schema);

export default model;
