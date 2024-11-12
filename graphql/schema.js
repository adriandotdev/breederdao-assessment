const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLList,
	GraphQLString,
	GraphQLInt,
} = require("graphql");

const AxiesRepository = require("../repositories/AxiesRepository");
const AuthenticationMiddleware = require("../middlewares/AuthenticationMiddleware");
const { HttpUnauthorized } = require("../utils/HttpError");

const DEFAULT = new GraphQLObjectType({
	name: "DEFAULT",
	fields: () => ({
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		stage: { type: GraphQLInt },
		class: { type: GraphQLString },
	}),
});

const AXIES = new GraphQLObjectType({
	name: "AXIES",
	fields: () => ({
		aquatic: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("aquatic_class");
				return result;
			},
		},
		beast: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("beast_class");
				return result;
			},
		},
		bird: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("bird_class");
				return result;
			},
		},
		bug: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("bug_class");
				return result;
			},
		},
		dusk: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("dusk_class");
				return result;
			},
		},
		mech: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("mech_class");
				return result;
			},
		},
		plant: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("plant_class");
				return result;
			},
		},
		reptile: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("reptile_class");
				return result;
			},
		},
		dawn: {
			type: new GraphQLList(DEFAULT),
			resolve: async function () {
				const result = await repository.GetAxies("dawn_class");
				return result;
			},
		},
	}),
});

const repository = new AxiesRepository();
const authMiddleware = new AuthenticationMiddleware();

const RootQuery = new GraphQLObjectType({
	name: "RootQueryType",
	fields: {
		axies: {
			type: AXIES,
			resolve: async (_, args, context) => {
				const isValid = await authMiddleware.GraphQLAccessTokenVerifier(
					context.auth
				);

				if (!isValid) throw new HttpUnauthorized("UNAUTHORIZED", null);

				return {};
			},
		},
	},
});

module.exports = new GraphQLSchema({
	query: RootQuery,
});
