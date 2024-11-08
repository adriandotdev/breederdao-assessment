const path = require("path");
require("dotenv").config({
	encoding: "utf8",
	debug:
		process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test"
			? true
			: true,
	path: path.resolve(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const app = express();

// Loggers
const morgan = require("morgan");
const logger = require("./utils/logger");

// Global Middlewares
app.use(helmet());
app.use(helmet.frameguard({ action: "deny" }));

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:5173",
			"https://v2-stg-parkncharge.sysnetph.com",
			"http://localhost:3001",
			"https://v2-admin-parkncharge.sysnetph.com",
		],
		methods: ["OPTIONS", "GET", "POST", "PUT", "DELETE", "PATCH"],
	})
);
app.use(express.urlencoded({ extended: false })); // To parse the urlencoded : x-www-form-urlencoded
app.use(express.json()); // To parse the json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: logger.stream }));
app.use(cookieParser());

require("./apis/accounts.api")(app);
require("./apis/axies.api")(app);

app.use("*", (req, res, next) => {
	logger.error({
		API_NOT_FOUND: {
			api: req.baseUrl,
			status: 404,
		},
	});
	return res.status(404).json({ status: 404, data: [], message: "Not Found" });
});

module.exports = app;
