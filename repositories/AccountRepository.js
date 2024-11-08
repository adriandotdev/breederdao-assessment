const AccountModel = require("../models/AccountModel");

class AccountRepository {
	CheckUsernameExists(username) {
		return new Promise(async (resolve, reject) => {
			try {
				const user = await AccountModel.findOne({ username });

				resolve(user === null ? false : true);
			} catch (err) {
				reject(err);
			}
		});
	}

	Register(payload) {
		return new Promise(async (resolve, reject) => {
			try {
				const account = new AccountModel({
					username: payload.username,
					password: payload.password,
				});

				const newAccount = await account.save();

				resolve(newAccount);
			} catch (err) {
				reject(err);
			}
		});
	}

	FindUsername(username) {
		return new Promise(async (resolve, reject) => {
			try {
				const account = await AccountModel.findOne(
					{ username },
					"_id username password"
				);

				resolve(account._doc);
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = AccountRepository;
