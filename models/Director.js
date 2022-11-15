const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	name: String,
	age: Number,
	country: String,
	generation: Number,
	style: Array,
});

module.exports = mongoose.model("Directors", schema);
