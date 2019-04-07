const express = require('express')
const bodyParser = require('body-parser')

const db = require('./queries')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/restaurant/:id', db.getRestaurantById)
app.get('/restaurants', db.getRestaurants)
app.get('/restaurants/:name', db.getRestaurantsByName)
app.get('/restaurants/:name/:address', db.getRestaurantsByNameAndAddress)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
