const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 255,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
	},
});

module.exports = mongoose.model('User', userSchema);