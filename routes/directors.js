const express = require("express");
const router = express.Router();
const directorController = require("../controller/directorController");

router.get("/", directorController.getAllDirector); // Checked

router.put("/", directorController.createDirector); // Checked

router
	.route("/:id")
	.get(directorController.getDirectorById) // Checked
	.post(directorController.updateDirectorById) // Checked
	.delete(directorController.deleteDirectorById); // Checked

module.exports = router;
