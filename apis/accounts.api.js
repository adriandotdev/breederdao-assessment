const logger = require("../utils/logger");

/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
	app.post(
		"/api/v1/accounts/register",
		[],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 */
		(req, res, next) => {
			try {
				logger.info({
					REGISTER_ACCOUNT_REQUEST: {
						data: {
							...req.body,
						},
					},
				});

				logger.info({
					REGISTER_ACCOUNT_RESPONSE: {
						message: "SUCCESS",
					},
				});

				return res
					.status(201)
					.json({ statusCode: 201, data: {}, status: "Created" });
			} catch (err) {
				req.error_name = "REGISTER_ACCOUNT_ERROR";
				next(err);
			}
		}
	);

	app.use((err, req, res, next) => {
		logger.error({
			API_REQUEST_ERROR: {
				error_name: req.error_name || "UNKNOWN_ERROR",
				message: err.message,
				stack: err.stack.replace(/\\/g, "/"), // Include stack trace for debugging
				request: {
					method: req.method,
					url: req.url,
					code: err.status || 500,
				},
				data: err.data || [],
			},
		});

		const status = err.status || 500;
		const message = err.message || "Internal Server Error";

		res.status(status).json({
			status,
			data: err.data || [],
			message,
		});
	});
};
