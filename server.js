const app = require("./app");

const httpServer = require("http").createServer(app);

const logger = require("./utils/logger");

const mongoose = require("mongoose");

httpServer.listen(process.env.PORT, () => {
	logger.info("Server is running on port: " + process.env.PORT);

	const dbUsername = process.env.DB_USERNAME;
	const dbPassword = process.env.DB_PASSWORD;
	const dbDatabaseName = process.env.DB_DATABASE_NAME;

	mongoose
		.connect(
			`mongodb+srv://${dbUsername}:${dbPassword}@myatlasclusteredu.1mtwqh7.mongodb.net/${dbDatabaseName}?retryWrites=true&w=majority&appName=myAtlasClusterEDU`
		)
		.then(() => logger.info(`Connected to MongoDB - ${dbDatabaseName}`))
		.catch((err) =>
			logger.info({
				DB_CONNECTION_ERROR: {
					message: err.message,
					stack: err.stack.replace(/\\/g, "/"), // Include stack trace for debugging
				},
			})
		);
});
