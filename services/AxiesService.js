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
		const result = this.#repository.GetAxies(className);

		return result;
	}
}

module.exports = AxiesService;
