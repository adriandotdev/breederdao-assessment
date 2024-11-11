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
	GetAllAxies() {
		return new Promise(async (resolve, reject) => {
			try {
				const collections = await mongoose.connection.db
					.listCollections()
					.toArray();

				let classes = {};

				await Promise.all(
					collections.map(async (collection) => {
						if (
							!classes[collection.name] &&
							collection.name.includes("_class")
						) {
							classes[collection.name] = collection.name;
						}

						if (collection.name.includes("_class"))
							classes[collection.name] = await mongoose.connection.db
								.collection(collection.name)
								.find()
								.toArray();
					})
				);

				resolve(classes);
			} catch (err) {
				reject(err);
			}
		});
	}

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
