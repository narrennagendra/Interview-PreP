const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
	title: {
	  type: String,
	  required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	body: {
	  type: Object,
	  required: true,
	},
	date: {
	  type: Date,
	  default: Date.now,
	},
  });
  
  module.exports = mongoose.model("Blog", blogSchema);