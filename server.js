const app = require("./app");

const httpServer = require("http").createServer(app);

const logger = require("./utils/logger");

const mongoose = require("mongoose");

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbDatabaseName = process.env.DB_DATABASE_NAME;

const MONGO_LINK = `${
	process.env.NODE_ENV === "prod"
		? `mongodb+srv://${dbUsername}:${dbPassword}@myatlasclusteredu.1mtwqh7.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU`
		: `mongodb://localhost:27017/sample-project`
}`;

logger.info(`Mongo Link: ${MONGO_LINK}`);

mongoose
	.connect(MONGO_LINK, { dbName: dbDatabaseName })
	.then(() => {
		logger.info("Connected to MongoDB");

		httpServer.listen(process.env.PORT, () => {
			logger.info("Server is running on port: " + process.env.PORT);
		});
	})
	.catch((err) =>
		logger.info({
			DB_CONNECTION_ERROR: {
				message: err.message,
				stack: err.stack.replace(/\\/g, "/"), // Include stack trace for debugging
			},
		})
	);
