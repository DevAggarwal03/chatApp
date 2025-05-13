const {Client} = require('pg')
require('dotenv').config();

const dbUrl = process.env.connectionString;
const pgClient = new Client(dbUrl)
pgClient.connect()
    .then(() => {console.log('db started')})
    .catch((e) => console.log(e));

module.exports = pgClient