var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var request = require('request');
var rp = require('request-promise');


const port = 4040;

// GraphQL schema
var schema = buildSchema(`
    type Query {
        message: String,
        restaurants(name: String!, address: String): [Restaurant]
        restaurant(id: Int!) : Restaurant
        restaurantViolations(id: Int!) : RestaurantViolations
    }

    type Restaurant {
        name: String,
        address: String,
        city: String,
        state: String,
        zip: Int,
        propertyId : Int
    }

    type RestaurantViolations {
        restaurant: Restaurant
        violations: [Violation]
    }

    type Violation {
        date: String,
        code: String,
        description: String,
        level: String,
        comments: String
    }

`);

// Root resolver
var root = {
    message: () => 'Hello World!',

    restaurants: (args) => {
        return rp('http://localhost:3000/restaurants/' + args.name)
        .then( data => {

            dataObj = JSON.parse(data)

            rests = [];
            for (iRest in dataObj){

                restau = dataObj[iRest];

                rest = {};
                rest.name = restau.businessname;
                rest.address = restau.address;
                rest.city = restau.city;
                rest.state = restau.state;
                rest.zip = restau.zip;
                rest.propertyId = restau.property_id;

                rests.push(rest);
            }
            return rests;
        })
    },

    restaurantViolations: (args) => {
        return rp('http://localhost:3000/restaurant/' + args.id)
        .then( data => {

            dataObj = JSON.parse(data)

            result = {};
            vios = [];
            for (iVio in dataObj){

                vio = dataObj[iVio];

                if (!result.restaurant) {

                    rest = {};
                    rest.name = vio.businessname;
                    rest.address = vio.address;
                    rest.city = vio.city;
                    rest.state = vio.state;
                    rest.zip = vio.zip;
                    rest.propertyId = vio.property_id;

                    result.restaurant = rest;
                }

                viol = {}
                viol.result = vio.result
                viol.date = vio.resultdttm
                viol.code = vio.violation
                viol.level = vio.viollevel
                viol.description = vio.violdesc
                viol.comments = vio.comments
                vios.push(viol)
            }

            result.violations = vios;
            return result;
        })
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
