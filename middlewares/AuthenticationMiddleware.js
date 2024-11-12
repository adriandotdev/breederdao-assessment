const jwt = require("jsonwebtoken");

const {
	HttpUnauthorized,
	HttpInternalServerError,
} = require("../utils/HttpError");

class AuthenticationMiddleware {
	AccessTokenVerifier() {
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 */
		return async (req, res, next) => {
			try {
				const type = req.headers["authorization"]?.split(" ")[0];
				const accessToken = req.headers["authorization"]?.split(" ")[1];

				if (!accessToken) throw new HttpUnauthorized("Unauthorized", []);

				if (type !== "Bearer") throw new HttpUnauthorized("Unauthorized", []);

				jwt.verify(
					accessToken,
					process.env.ACCESS_TOKEN_SECRET_KEY,
					(err, decode) => {
						if (err) {
							if (err instanceof jwt.TokenExpiredError) {
								throw new HttpUnauthorized("TOKEN_EXPIRED", []);
							} else if (err instanceof jwt.JsonWebTokenError) {
								throw new HttpUnauthorized("Invalid Token", []);
							} else {
								throw new HttpInternalServerError("Internal Server Error", []);
							}
						}
						next();
					}
				);
			} catch (err) {
				req.error_name = "ACCESS_TOKEN_ERROR";
				next(err);
			}
		};
	}

	async GraphQLAccessTokenVerifier(auth) {
		try {
			let isValid = false;

			if (!auth) throw new HttpUnauthorized("UNAUTHORIZED", []);

			const accessToken = auth.split(" ")[1];

			if (!accessToken) throw new HttpUnauthorized("UNAUTHORIZED", []);

			jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET_KEY,
				(err, decode) => {
					if (err) {
						if (err instanceof jwt.TokenExpiredError) {
							throw new HttpUnauthorized("TOKEN_EXPIRED", []);
						} else if (err instanceof jwt.JsonWebTokenError) {
							throw new HttpUnauthorized("INVALID_TOKEN", []);
						} else {
							throw new HttpInternalServerError("Internal Server Error", []);
						}
					}
					isValid = true;
				}
			);

			return isValid;
		} catch (err) {
			if (err !== null) {
				throw new HttpUnauthorized(err.message, []);
			}

			throw new HttpInternalServerError("INTERNAL_SERVER_ERROR", []);
		}
	}
}

module.exports = AuthenticationMiddleware;
