const AccountRepository = require("../repositories/AccountRepository");
const bcrypt = require("bcrypt");
const { HttpBadRequest, HttpUnauthorized } = require("../utils/HttpError");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class AccountService {
	/**
	 * @type {AccountRepository}
	 */
	#repository;

	constructor(repository) {
		this.#repository = repository;
	}

	async Register(payload) {
		if (await this.#repository.CheckUsernameExists(payload.username))
			throw new HttpBadRequest("USERNAME_ALREADY_EXISTS", null);

		const hashedPassword = await bcrypt.hash(payload.password, 10);

		const result = await this.#repository.Register({
			...payload,
			password: hashedPassword,
		});

		return result;
	}

	async Login(payload) {
		if (!(await this.#repository.CheckUsernameExists(payload.username)))
			throw new HttpUnauthorized("INVALID_CREDENTIALS", null);

		const account = await this.#repository.FindUsername(payload.username);

		const isMatch = await bcrypt.compare(payload.password, account.password);

		if (!isMatch) throw new HttpUnauthorized("INVALID_CREDENTIALS", null);

		const accessTokenExpiration = Math.floor(Date.now() / 1000) + 60 * 15;

		const accessToken = jwt.sign(
			{
				data: {
					username: account.username,
					userId: account._id,
				},
				jti: uuidv4(),
				aud: "audience",
				iss: "issuer",
				iat: Math.floor(Date.now() / 1000),
				typ: "Bearer",
				exp: accessTokenExpiration,
				usr: "serv",
			},
			process.env.ACCESS_TOKEN_SECRET_KEY
		);

		return { access_token: accessToken };
	}
}

module.exports = AccountService;
