import mongoose from "mongoose";



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
	//channels: {
	//	type: [
	//		{
	//			type: mongoose.Schema.Types.ObjectId,
	//			ref: "Channel",
	//		},
	//	],
	//},
	//groupInboxes: {
	//	type: [
	//		{
	//			type: mongoose.Schema.Types.ObjectId,
	//			ref: "GroupInbox",
	//		},
	//	],
	//},
	//privateInboxes: {
	//	type: [
	//		{
	//			type: mongoose.Schema.Types.ObjectId,
	//			ref: "PrivateInbox",
	//		},
	//	],
	//},
})


const model = mongoose.models?.User || mongoose.model("User", schema);

export default model;
