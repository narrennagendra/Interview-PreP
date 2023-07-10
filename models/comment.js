const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	authorName: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true
	},
	children: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Comment', commentSchema);