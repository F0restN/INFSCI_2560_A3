const express = require("express");
const router = express.Router();
const directorController = require("../controller/directorController");
const movieController = require("../controller/movieController");
const Movies = require("../models/Movie");
const Directors = require("../models/Director");
const { statusHandler } = require("../middleware/errorHandler");

// All
router.get("/", async (req, res) => {
	const movies = await Movies.find({});
	const directors = await Directors.find({});
	statusHandler(req, res, 200, [{ movies: movies }, { directors: directors }]);
}); // Checked

// Movie
router.get("/movies", movieController.getAllMovies); // Checked
router.put("/movies", movieController.createMovie); // Checked
router.patch("/movies/bulkcreate", movieController.bulkCreateMovie);
router
	.route("/movies/:id")
	.get(movieController.getMovieById) // Checked
	.post(movieController.updateMovieById) // Checked
	.delete(movieController.deleteMovieById); // Checked
router.get("/movies/:id/detail", movieController.getMovieDetailsById); //checked

// Director
router.get("/directors", directorController.getAllDirector);
router.put("/directors", directorController.createDirector);
router
	.route("/directors/:id")
	.get(directorController.getDirectorById)
	.post(directorController.updateDirectorById)
	.delete(directorController.deleteDirectorById);

module.exports = router;
