const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const db = new sqlite3.Database(path.resolve(__dirname, '../database.db'), (error) => {
    if (error) {
        console.error('Error connecting to the database', error.message);
    }
    console.log('Connected to the SQLITE Database');
});

module.exports = db;

