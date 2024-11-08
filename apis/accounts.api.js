const AccountRepository = require("../repositories/AccountRepository");
const AccountService = require("../services/AccountService");
const logger = require("../utils/logger");

/**
 * @param {import('express').Express} app
 */
module.exports = (app) => {
	const service = new AccountService(new AccountRepository());

	app.post(
		"/api/v1/accounts/register",
		[],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 */
		async (req, res, next) => {
			try {
				logger.info({
					REGISTER_ACCOUNT_REQUEST: {
						data: {
							...req.body,
						},
					},
				});

				const { username, password } = req.body;

				const newAccount = await service.Register({ username, password });

				logger.info({
					REGISTER_ACCOUNT_RESPONSE: {
						message: "SUCCESS",
					},
				});

				return res
					.status(201)
					.json({ statusCode: 201, data: newAccount, status: "Created" });
			} catch (err) {
				req.error_name = "REGISTER_ACCOUNT_ERROR";
				next(err);
			}
		}
	);

	app.post(
		"/api/v1/accounts/login",
		[],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 */
		async (req, res, next) => {
			try {
				logger.info({
					LOGIN_REQUEST: {
						data: { ...req.body },
					},
				});

				const { username, password } = req.body;

				const result = await service.Login({ username, password });

				return res
					.status(200)
					.json({ statusCode: 200, data: result, status: "OK" });
			} catch (err) {
				req.error_name = "LOGIN_ERROR";
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
