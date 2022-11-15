const Directors = require("../models/Director");
const { statusHandler } = require("../middleware/errorHandler");

exports.createDirector = async (req, res) => {
	try {
		const newDirector = new Directors(req.body);
		await newDirector.save();
		statusHandler(req, res, 200, newDirector);
	} catch (error) {
		statusHandler(req, res, 400, error);
	}
};

exports.getDirectorById = async (req, res) => {
	const id = req.params["id"];
	Directors.findById(id, (err, director) => {
		if (err) {
			statusHandler(req, res, 403, err);
		} else {
			statusHandler(req, res, 200, director);
		}
	});
};

exports.getAllDirector = async (req, res) => {
	const directorList = await Directors.find({});
	statusHandler(req, res, 200, directorList);
};

// Experimental method, see if it can catch error.
exports.updateDirectorById = async (req, res) => {
	try {
		const id = req.params["id"];
		Directors.findByIdAndUpdate(id, req.body, (err, updatedDirector) => {
			if (err) {
				statusHandler(req, res, 404, err);
			} else {
				statusHandler(req, res, 200, updatedDirector);
			}
		});
	} catch (error) {
		statusHandler(req, res, 404, error);
	}
};

exports.deleteDirectorById = async (req, res) => {
	try {
		const id = req.params["id"];
		const updatedDirector = await Directors.findByIdAndDelete(id, req.body);
		statusHandler(req, res, 200, updatedDirector);
	} catch (error) {
		statusHandler(req, res, 404, error);
	}
};
