const app = require("./app");

const httpServer = require("http").createServer(app);

const logger = require("./utils/logger");

httpServer.listen(process.env.PORT, () => {
	logger.info("Server is running on port: " + process.env.PORT);
});
