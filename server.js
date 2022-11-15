const environment = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const letterboxRouter = require("./routes/letterbox");

const app = express();

const mongoDB =
	"mongodb+srv://" +
	process.env.USERNAME +
	":" +
	process.env.PASSWORD +
	"@" +
	process.env.HOST +
	"/" +
	process.env.DATABASE;

// Error handling for initialize
mongoose
	.connect(mongoDB, {
		useNewUrlParser: true,
		retryWrites: true,
	})
	.catch((error) => {
		console.error({
			mssg: "Database connect failed",
			info: error,
		});
	});

// Activate server after establish connection
mongoose.connection.once("open", () => {
	app.emit("dbReady");
});

// Error handling for error after initial
mongoose.connection.on("error", (error) => {
	app.emit("dbFailed");
	console.error({
		mssg: "Database connect failed",
		info: error,
	});
});

// app.set("view engine", "ejs");
app.use(express.json());
app.get("/", function (request, response) {
	response.json({
		message: "Please see the README.md for documentation",
	});
});

app.use("/letterbox", letterboxRouter);

app.on("dbReady", function () {
	const listener = app.listen(process.env.PORT, function () {
		console.log("Your app is listening on port " + listener.address().port);
	});
});
