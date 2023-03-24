const Sequelize = require('sequelize')
require('dotenv').config()

const {CONNECTION_STRING} = process.env

// include and initialize the rollbar library with your access token
const Rollbar = require('rollbar')
const rollbar = new Rollbar({
  accessToken: '6d92301506e74adfba423b70b9c9d773',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    createFighter: (req, res) => {

        rollbar.info('fighter is being created')

        let {name, power, hp, type} = req.body
    
        sequelize.query(`
            INSERT INTO fighters (name, power, hp, type)
            VALUES ('${name}', ${power}, ${hp}, '${type}')
            RETURNING *;
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((err) => {
            rollbar.critical('fighter not created due to sequelize error: this is BAD')
            console.log('you had a Sequelize error in createFighter:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    createWeapon: (req, res) => {
        let {name, power, owner} = req.body
    
        sequelize.query(`
            INSERT INTO weapons (name, power, owner_id)
            VALUES ('${name}', ${power}, ${owner})
            RETURNING *;
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((err) => {
            rollbar.error('weapon not created due to sequelize error.')
            console.log('you had a Sequelize error in createWeapon:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    getFightersList: (req, res) => {
        sequelize.query(`
            SELECT name, id FROM fighters;
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((err) => {
            console.log('you had a Sequelize error in getFightersList:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    getFightersWeapons: (req, res) => {
        sequelize.query(`
            SELECT
                fighters.id AS fighter_id,
                fighters.name AS fighter,
                fighters.power AS fighter_power,
                hp,
                type,
                weapons.id AS weapon_id,
                weapons.name AS weapon,
                weapons.power AS weapon_power
            FROM fighters
            JOIN weapons
            ON fighters.id = weapons.owner_id;
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((err) => {
            console.log('you had a Sequelize error in getFightersWeapons:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    deleteWeapon: (req, res) => {
        const id = req.params.id

        sequelize.query(`
            DELETE FROM weapons
            WHERE id = ${id};
        `)
        .then((dbResult) => {
            res.status(200).send(dbResult[0])
        })
        .catch((err) => {
            console.log('you had a Sequelize error in deleteWeapon:')
            console.log(err)
            res.status(500).send(err)
        })
    }
}