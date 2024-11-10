class ModelFactory {
	static GetModel(className) {
		if (!schemas[className]) {
			const schema = new mongoose.Schema(
				{ id: String, name: String, stage: Number, class: String },
				{ collection: className }
			);
			schemas[className] = mongoose.model(className, schema);
		}
		return schemas[className];
	}
}
