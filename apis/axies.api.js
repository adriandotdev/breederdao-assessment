const axios = require("axios");
const { Web3 } = require("web3");

module.exports = (app) => {
	app.get(
		"/api/v1/axies",
		[],

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

				return res.status(200).json({
					statusCode: 200,
					data: result.data.data.axies.results,
					status: "OK",
				});
			} catch (err) {
				req.error_name = "GET_AXIES_ERROR";
				next(err);
			}
		}
	);

	app.get("/api/v1/axies/test", [], async (req, res, next) => {
		/**
		 * 4194c170500943229aaaa2ad5775f19b
		 * 0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d
		 *
		 *
		 */
		const INFURA_ID = `4194c170500943229aaaa2ad5775f19b`;
		const AXIE_CONTRACT_ADDRESS = `0xF5b0A3eFB8e8E4c201e2A935F110eAaF3FFEcb8d`;

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

		const axieContract = new web3.eth.Contract(AXIE_ABI, AXIE_CONTRACT_ADDRESS);

		/**
         * 	{
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
         */
		const result = await axieContract._methods.getAxie(3284776).call();

		console.log(axieContract._methods);
		return res.status(200).json({ details: {} });
	});
};
