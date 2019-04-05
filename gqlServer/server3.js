var express = require('express');
var express_graphql = require('express-graphql');
// var { buildSchema } = require('graphql');

// import { importSchema } from 'graphql-import'
// import { makeExecutableSchema } from 'graphql-tools'

const importSchema = require('graphql-import')
const makeExecutableSchema = require('graphql-tools')

const typeDefs = importSchema('schema.graphql')
const resolvers = {}

const schema = makeExecutableSchema({ typeDefs })

const port = 4041;

// Root resolver
var root = {
    message: () => 'Hello World!'
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(port, () => console.log('Express GraphQL Server Now Running On localhost:'+ port+ '/graphql'));
