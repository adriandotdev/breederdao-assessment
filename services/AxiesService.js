const AxiesRepository = require("../repositories/AxiesRepository");

class AxiesService {
	/**
	 * @type {AxiesRepository}
	 */
	#repository;

	constructor(repository) {
		this.#repository = repository;
	}

	async GetAxies(className) {
		let result = null;

		if (className.toLowerCase() === "all") {
			result = await this.#repository.GetAllAxies();
		} else {
			result = this.#repository.GetAxies(className.toLowerCase() + "_class");
		}

		return result;
	}
}

module.exports = AxiesService;
