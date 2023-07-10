const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	problemStatement: [{ type: Object, required: true }],
	editorial: [{ type: Object, required: true }],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Problem', problemSchema);