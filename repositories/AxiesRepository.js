const mongoose = require("mongoose");
schemas = [];

function GetModel(className) {
	if (!schemas[className]) {
		const schema = new mongoose.Schema(
			{ id: String, name: String, stage: Number, class: String },
			{ collection: className }
		);
		schemas[className] = mongoose.model(className, schema);
	}
	return schemas[className];
}

class AxiesRepository {
	GetAxies(className) {
		return new Promise(async (resolve, reject) => {
			try {
				const Model = GetModel(className);

				const result = await Model.find();

				resolve(result);
			} catch (err) {
				reject(err);
			}
		});
	}
}

module.exports = AxiesRepository;
