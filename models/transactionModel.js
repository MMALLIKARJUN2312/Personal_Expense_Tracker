const db = require('../config/db');

const addTransaction = (transaction, callback) => {
    const {type, category, amount, date, description} = transaction
    db.run('INSERT INTO transactions (type, category, amount, date, description) VALUES (?,?,?,?,?)'), 
    [type, category, amount, date, description], function(error) {
        callback(error, this.lastID);
    }
};

const getAllTransactions = (callback) => {
    db.all('SELECT * FROM transactions', [], (error, rows) => {
        callback(error, rows);
    })
};

const getTransactionById = (id, callback) => {
    db.get('SELECT * FROM transactions WHERE id = ?', [id], (error, row) => {
        callback(error, row);
    })
};

const updateTransaction = (id, transaction, callback) => {
    const {type, category, amount, date, description} = transaction;
    db.run('UPDATE transaction SET type = ? category = ? amount = ? date = ? description = ? WHERE id = ?', 
        [type, category, amount, date, description, id], function (error) {
            callback(error);
        }
    )
};

const deleteTransactionById = (id, callback) => {
    db.run('DELETE FROM transactions WHERE id = ?', [id], (error) => {
        callback(error);
    })
};

const transactionSummary = (startDate, endDate, callback) => {
    let query = 'SELECT type, SUM(amount) AS total FROM transactions';
    let params = [];

    if (startDate && endDate) {
        query += 'WHERE date BETWEEN ? AND ?';
        params.push(startDate, endDate);
    }
    query += 'GROUP BY type';

    db.all(query, params, (error, rows) => {
        callback(error, rows);
    })
};

const getMonthlyReport = (userId, callback) => {
    db.all(`
        SELECT strftime('%Y-%m', date) AS month, category, SUM(amount) AS total
        FROM transactions
        WHERE userId = ?
        GROUP BY month, category
    `, [userId], callback);
};

module.exports = {addTransaction, getAllTransactions, getTransactionById, 
    updateTransaction, deleteTransactionById, transactionSummary, getMonthlyReport
};