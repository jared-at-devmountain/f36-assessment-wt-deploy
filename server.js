
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.static(__dirname + '/public'))

// include and initialize the rollbar library with your access token
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: '6d92301506e74adfba423b70b9c9d773',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

const {PORT} = process.env
const {
    createFighter,
    createWeapon,
    getFightersList,
    getFightersWeapons,
    deleteWeapon,
} = require('./controller.js')

app.post('/fighter', createFighter)
app.post('/weapon', createWeapon)
app.get('/fighters-list', getFightersList)
app.get('/fighters-and-weapons', getFightersWeapons)
app.delete('/weapon/:id', deleteWeapon)

app.listen(PORT, () => console.log(`up on ${PORT}`))