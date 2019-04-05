var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var request = require('request');
var rp = require('request-promise');
var $ = require('jquery');

const port = 4040;

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String,
        help: String,
        test: String,
        rollDice(numDice: Int!, numSides: Int): [Int],
        restaurants(name: String!): Restaurant
    }

    type Restaurant {
        name: String,
        address: String,
        property_id : Int

    }

    type Inspection {
        restaurant: Restaurant,
        dateOfInspection: String,
        violation: Violation
    }

`);

// Root resolver
var root = {
    message: () => 'Hello World!',
    help: () => 'Hope this is helpful.',
    restaurants: (args) => {
        return rp('http://localhost:3000/restaurants/' + args.name)
        .then( data => {
            newData = "{ data:" + data + "}"
            dataObj = JSON.parse(data)
            console.log(typeof dataObj)
            console.log(dataObj)
            return dataObj.join("\n")
        } )
    },
    rollDice: (args) => {
        var out = [];
        for (var i = 0; i < args.numDice; i++) {
            out.push(1 + Math.floor(Math.random() * (args.numSides || 6)));
        }
        return out;
    }
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(port, () => console.log('Express GraphQL Server Now Running On localhost:'+ port+ '/graphql'));
