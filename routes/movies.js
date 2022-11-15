const express = require("express");
const router = express.Router();
const movieController = require("../controller/movieController");

// Movies
router.get("/", movieController.getMovies);

router.get("/movies", movieController.getMovies); // Checked

router.put("/movies", movieController.createMovie); // Checked

router
	.route("/movies/:id")
	.get(movieController.getMovieById) // Checked
	.post(movieController.updateMovieById) // Checked
	.delete(movieController.deleteMovieById); // Checked

router.get("/movies/:id/detail", movieController.getMovieDetailsById); //checked

module.exports = router;
