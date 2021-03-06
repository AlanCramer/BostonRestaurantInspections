const Pool = require('pg').Pool
const pool = new Pool({
  user: 'cramera',
  host: 'localhost',
  database: 'boston_restaurants',
  password: '*****',
  port: 5432,
})

const getRestaurants = (request, response) => {
  pool.query('SELECT * FROM restaurant_inspection limit 100', (error, results) => {
    if (error) { throw error }

    response.status(200).json(results.rows)
  })
}

const getRestaurantById = (request, response) => {
    const id = request.params.propertyId

    var query = `
        SELECT
        businessname, address, city, state, zip, property_id,
        result, resultdttm, violation, viollevel, violdesc, comments
        FROM restaurant_inspection
        WHERE property_id=`
        + id + ' limit 200';

    console.log(id)
    console.log(query)

    pool.query(query, (error, results) => {
      if (error) { throw error }

      response.status(200).json(results.rows)
    })
}

const getRestaurantsByName = (request, response) => {
  const name = request.params.name

  var query = `
    SELECT DISTINCT ON (businessname, address)
    businessname, address, city, state, zip, property_id
    FROM restaurant_inspection
    WHERE businessname ilike `
    + '\'%' + name + '%\' limit 100';

    pool.query(query, (error, results) => {
      if (error) { throw error }

      response.status(200).json(results.rows)
    })
}

module.exports = {
    getRestaurantById,
    getRestaurants,
    getRestaurantsByName,
}
