const { Console } = require('winston/lib/winston/transports')

require('dotenv').config()

module.exports = {
    "migrationDirectory": "migrations", 
    "driver": "pg", 
    "connectionString": process.env.NODE_ENV === 'test' 
                        ? process.env.TEST_DATABASE_URL 
                        : process.env.DATABASE_URL, 
    "ssl": !process.env.SSL,
    // ssl: {
    //     required: true,
    //     rejectUnauthorized: false
    //}
}
console.log("Process.env.SSL: ", !process.env.SSL)