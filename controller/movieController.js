const Movies = require("../models/Movie");
const { statusHandler } = require("../middleware/errorHandler");

exports.bulkCreateMovie = async (req, res) => {
	await Movies.create(req.body);
	statusHandler(req, res, 200, req.body);
};

exports.createMovie = async (req, res) => {
	try {
		const newMovie = new Movies(req.body);
		await newMovie.save();
		statusHandler(req, res, 200, newMovie);
	} catch (error) {
		statusHandler(req, res, 400, error);
	}
};

exports.getAllMovies = async (req, res) => {
	const moviesList = await Movies.find();
	statusHandler(req, res, 200, moviesList);
};

exports.getMovieById = async (req, res) => {
	const id = req.params["id"];
	Movies.findById(id, (err, movie) => {
		if (err) {
			statusHandler(req, res, 403, err);
		} else {
			statusHandler(req, res, 200, movie);
		}
	});
};

exports.getMovieDetailsById = async (req, res) => {
	const id = req.params["id"];
	Movies.findById(id, (err, movie) => {
		if (err) {
			statusHandler(req, res, 403, err);
		} else {
			statusHandler(req, res, 200, movie["detail"]);
		}
	});
};

// Experimental method, see if it can catch error.
exports.updateMovieById = async (req, res) => {
	try {
		const id = req.params["id"];
		Movies.findByIdAndUpdate(id, req.body, (err, updatedMovie) => {
			if (err) {
				statusHandler(req, res, 404, err);
			} else {
				statusHandler(req, res, 200, updatedMovie);
			}
		});
	} catch (error) {
		statusHandler(req, res, 404, error);
	}
};

exports.deleteMovieById = async (req, res) => {
	try {
		const id = req.params["id"];
		const updatedMovie = await Movies.findByIdAndDelete(id, req.body);
		statusHandler(req, res, 200, updatedMovie);
	} catch (error) {
		statusHandler(req, res, 404, error);
	}
};
