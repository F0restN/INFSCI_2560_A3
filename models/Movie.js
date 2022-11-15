const mongoose = require("mongoose");

const schema = new mongoose.Schema({
	name: String,
	director: String,
	genres: Array,
	rating: Number,
	detail: {
		year: Number,
		desc: String,
	},
});

module.exports = mongoose.model("Movies", schema);
