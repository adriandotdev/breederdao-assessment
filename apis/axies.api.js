const axios = require("axios");
const { Web3 } = require("web3");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const AxiesService = require("../services/AxiesService");
const AxiesRepository = require("../repositories/AxiesRepository");

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

module.exports = (app) => {
	const service = new AxiesService(new AxiesRepository());
	const authMiddleware = new AuthenticationMiddleware();

	app.post(
		"/api/v1/axies",
		[authMiddleware.AccessTokenVerifier()],

		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 * @returns
		 */
		async (req, res, next) => {
			try {
				const result = await axios.post(
					"https://graphql-gateway.axieinfinity.com/graphql",
					{
						operationName: "GetAxieLatest",
						variables: {
							from: 0,
							size: 300,
							sort: "PriceAsc",
							auctionType: "All",
							criteria: {},
						},
						query:
							"query GetAxieLatest($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\n  axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n    total\n    results {\n      ...AxieRowData\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment AxieRowData on Axie {\n  id\n  image\n  class\n  name\n  genes\n  owner\n  class\n  stage\n  title\n  breedCount\n  parts {\n    ...AxiePart\n    __typename\n  }\n  stats {\n    ...AxieStats\n    __typename\n  }\n  __typename\n}\n\nfragment AxiePart on AxiePart {\n  id\n  name\n  class\n  type\n  specialGenes\n  stage\n  abilities {\n    ...AxieCardAbility\n    __typename\n  }\n  __typename\n}\n\nfragment AxieCardAbility on AxieCardAbility {\n  id\n  name\n  attack\n  defense\n  energy\n  description\n  backgroundUrl\n  effectIconUrl\n  __typename\n}\n\nfragment AxieStats on AxieStats {\n  hp\n  speed\n  skill\n  morale\n  __typename\n}\n",
					},
					{ headers: { "Content-Type": "application/json" } }
				);

				const axies = result.data.data.axies.results;

				const classes = axies.reduce((acc, item) => {
					const { id, name, stage, class: className } = item;
					if (!acc[className.toLowerCase() + "_class"]) {
						acc[className.toLowerCase() + "_class"] = [];
					}
					acc[className.toLowerCase() + "_class"].push({
						id,
						name,
						stage,
						class: className,
					});
					return acc;
				}, {});

				for (const [className, documents] of Object.entries(classes)) {
					const Model = GetModel(className);
					const result = await Model.insertMany(documents);
					console.log(
						`${result.length} documents inserted into ${className} collection`
					);
				}

				return res.status(200).json({
					statusCode: 200,
					data: [],
					status: "OK",
				});
			} catch (err) {
				req.error_name = "GET_AXIES_ERROR";
				next(err);
			}
		}
	);

	app.get(
		"/api/v1/axies/test",
		[authMiddleware.AccessTokenVerifier()],
		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 * @returns
		 */
		async (req, res, next) => {
			const INFURA_ID = process.env.INFURA_ID;
			const AXIE_CONTRACT_ADDRESS = process.env.AXIE_CONTRACT_ADDRESS;

			const AXIE_ABI = [
				{
					constant: true,
					inputs: [{ name: "interfaceID", type: "bytes4" }],
					name: "supportsInterface",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "cfoAddress",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "name",
					outputs: [{ name: "", type: "string" }],
					payable: false,
					stateMutability: "pure",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_tokenId", type: "uint256" }],
					name: "getApproved",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_approved", type: "address" },
						{ name: "_tokenId", type: "uint256" },
					],
					name: "approve",
					outputs: [],
					payable: true,
					stateMutability: "payable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "ceoAddress",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_axieId", type: "uint256" },
						{ name: "_genes", type: "uint256" },
					],
					name: "rebirthAxie",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "whitelistSetterAddress",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "totalSupply",
					outputs: [{ name: "", type: "uint256" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "marketplaceManager",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_manager", type: "address" }],
					name: "setRetirementManager",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_geneScientist", type: "address" },
						{ name: "_whitelisted", type: "bool" },
					],
					name: "setGeneScientist",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_from", type: "address" },
						{ name: "_to", type: "address" },
						{ name: "_tokenId", type: "uint256" },
					],
					name: "transferFrom",
					outputs: [],
					payable: true,
					stateMutability: "payable",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_newCEO", type: "address" }],
					name: "setCEO",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_newCOO", type: "address" }],
					name: "setCOO",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [
						{ name: "_owner", type: "address" },
						{ name: "_index", type: "uint256" },
					],
					name: "tokenOfOwnerByIndex",
					outputs: [{ name: "_tokenId", type: "uint256" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_manager", type: "address" }],
					name: "setMarketplaceManager",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [],
					name: "unpause",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_from", type: "address" },
						{ name: "_to", type: "address" },
						{ name: "_tokenId", type: "uint256" },
					],
					name: "safeTransferFrom",
					outputs: [],
					payable: true,
					stateMutability: "payable",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_newCFO", type: "address" }],
					name: "setCFO",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_index", type: "uint256" }],
					name: "tokenByIndex",
					outputs: [{ name: "", type: "uint256" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "retirementManager",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_newSetter", type: "address" }],
					name: "setWhitelistSetter",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "paused",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_genes", type: "uint256" },
						{ name: "_owner", type: "address" },
					],
					name: "spawnAxie",
					outputs: [{ name: "", type: "uint256" }],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [],
					name: "withdrawBalance",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_tokenId", type: "uint256" }],
					name: "ownerOf",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_owner", type: "address" }],
					name: "balanceOf",
					outputs: [{ name: "", type: "uint256" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_marketplace", type: "address" },
						{ name: "_whitelisted", type: "bool" },
					],
					name: "setMarketplace",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "geneManager",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_byeSayer", type: "address" },
						{ name: "_whitelisted", type: "bool" },
					],
					name: "setByeSayer",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [],
					name: "pause",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_manager", type: "address" }],
					name: "setSpawningManager",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [{ name: "_manager", type: "address" }],
					name: "setGeneManager",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "symbol",
					outputs: [{ name: "", type: "string" }],
					payable: false,
					stateMutability: "pure",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "", type: "address" }],
					name: "whitelistedByeSayer",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "spawningManager",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "", type: "address" }],
					name: "whitelistedGeneScientist",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_spawner", type: "address" },
						{ name: "_whitelisted", type: "bool" },
					],
					name: "setSpawner",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_operator", type: "address" },
						{ name: "_approved", type: "bool" },
					],
					name: "setApprovalForAll",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "", type: "address" }],
					name: "whitelistedMarketplace",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_axieId", type: "uint256" }],
					name: "getAxie",
					outputs: [
						{ name: "", type: "uint256" },
						{ name: "", type: "uint256" },
					],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_axieId", type: "uint256" },
						{ name: "_newGenes", type: "uint256" },
					],
					name: "evolveAxie",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "cooAddress",
					outputs: [{ name: "", type: "address" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_from", type: "address" },
						{ name: "_to", type: "address" },
						{ name: "_tokenId", type: "uint256" },
						{ name: "_data", type: "bytes" },
					],
					name: "safeTransferFrom",
					outputs: [],
					payable: true,
					stateMutability: "payable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "tokenURIPrefix",
					outputs: [{ name: "", type: "string" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "", type: "address" }],
					name: "whitelistedSpawner",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [{ name: "_tokenId", type: "uint256" }],
					name: "tokenURI",
					outputs: [{ name: "", type: "string" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_axieId", type: "uint256" },
						{ name: "_rip", type: "bool" },
					],
					name: "retireAxie",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					constant: true,
					inputs: [],
					name: "tokenURISuffix",
					outputs: [{ name: "", type: "string" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: true,
					inputs: [
						{ name: "_owner", type: "address" },
						{ name: "_operator", type: "address" },
					],
					name: "isApprovedForAll",
					outputs: [{ name: "", type: "bool" }],
					payable: false,
					stateMutability: "view",
					type: "function",
				},
				{
					constant: false,
					inputs: [
						{ name: "_prefix", type: "string" },
						{ name: "_suffix", type: "string" },
					],
					name: "setTokenURIAffixes",
					outputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "function",
				},
				{
					inputs: [],
					payable: false,
					stateMutability: "nonpayable",
					type: "constructor",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_axieId", type: "uint256" },
						{ indexed: true, name: "_owner", type: "address" },
						{ indexed: false, name: "_genes", type: "uint256" },
					],
					name: "AxieSpawned",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_axieId", type: "uint256" },
						{ indexed: false, name: "_genes", type: "uint256" },
					],
					name: "AxieRebirthed",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [{ indexed: true, name: "_axieId", type: "uint256" }],
					name: "AxieRetired",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_axieId", type: "uint256" },
						{ indexed: false, name: "_oldGenes", type: "uint256" },
						{ indexed: false, name: "_newGenes", type: "uint256" },
					],
					name: "AxieEvolved",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_from", type: "address" },
						{ indexed: true, name: "_to", type: "address" },
						{ indexed: false, name: "_tokenId", type: "uint256" },
					],
					name: "Transfer",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_owner", type: "address" },
						{ indexed: true, name: "_approved", type: "address" },
						{ indexed: false, name: "_tokenId", type: "uint256" },
					],
					name: "Approval",
					type: "event",
				},
				{
					anonymous: false,
					inputs: [
						{ indexed: true, name: "_owner", type: "address" },
						{ indexed: true, name: "_operator", type: "address" },
						{ indexed: false, name: "_approved", type: "bool" },
					],
					name: "ApprovalForAll",
					type: "event",
				},
			];

			const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_ID}`);

			const axieContract = new web3.eth.Contract(
				AXIE_ABI,
				AXIE_CONTRACT_ADDRESS
			);

			const result = await axieContract._methods.geneManager().call();

			return res
				.status(200)
				.json({ statusCode: 200, data: result, message: "OK" });
		}
	);

	app.get(
		"/api/v1/axies",
		[authMiddleware.AccessTokenVerifier()],

		/**
		 * @param {import('express').Request} req
		 * @param {import('express').Response} res
		 * @param {import('express').NextFunction} next
		 */
		async (req, res, next) => {
			try {
				logger.info({
					GET_AXIES_REQUEST: {
						data: {
							...req.query,
						},
					},
				});

				const { class_name } = req.query;

				const result = await service.GetAxies(class_name);

				return res
					.status(200)
					.json({ statusCode: 200, data: result, message: "OK" });
			} catch (err) {
				req.error_name = "GET_AXIES_ERROR";
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
