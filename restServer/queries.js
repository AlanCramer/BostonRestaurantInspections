const Pool = require('pg').Pool
const pool = new Pool({
  user: 'cramera',
  host: 'localhost',
  database: 'boston_restaurants',
  password: '*****',
  port: 5432,
})

const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurant_inspection', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getRestaurantsByName = (request, response) => {
  const name = request.params.name

  var query = `
    SELECT businessname, address, property_id
    FROM restaurant_inspection
    WHERE businessname ilike `
    + '\'%' + name + '%\'';

  makeQuery(query, response);
}

const getRestaurantsByNameAndAddress = (request, response) => {
  const name = request.params.name

  pool.query('SELECT businessname, address, property_id FROM restaurant_inspection WHERE businessname ilike $1 AND ', ['%' + name + '%'], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const makeQuery = (query, response) => {
    pool.query(query, (error, results) => {
      if (error) { throw error }

      response.status(200).json(results.rows)
    })
}

module.exports = {
  getRestaurants,
  getRestaurantsByName,
}