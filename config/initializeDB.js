const fs = require('fs');
const path = require('path');
const db = require('./db');

const initializeDatabase = () => {
    const schemaPath = path.join(__dirname, 'schema.sql');

    const sql = fs.readFileSync(schemaPath, 'utf-8');
    
    db.serialize(() => {
        db.exec(sql, (error) => {
            if (error) {
                console.error('Could not execute schema:', error);
            } else {
                console.log('Database initialized successfully');
            }
        });
    });
};

module.exports = initializeDatabase;
