const db = require('../config/db');

exports.addTransaction = (req, res) => {
    const { type, category, amount, date, description } = req.body;
    const userId = req.user.id;

    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: 'Invalid transaction type' });
    }
    if (!category || typeof category !== 'string') {
        return res.status(400).json({ error: 'Category is required and must be a string' });
    }
    if (amount == null || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Valid date is required' });
    }

    const transaction = { userId, type, category, amount, date, description };
    db.run('INSERT INTO transactions (userId, type, category, amount, date, description) VALUES (?, ?, ?, ?, ?, ?)', 
    [transaction.userId, transaction.type, transaction.category, transaction.amount, transaction.date, transaction.description], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Transaction added successfully' });
    });
};

exports.getAllTransactions = (req, res) => {
    const userId = req.user.id; 
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all('SELECT * FROM transactions WHERE userId = ? LIMIT ? OFFSET ?', [userId, limit, offset], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user' });
        }
        res.json(rows);
    });
};

exports.getTransactionById = (req, res) => {
    const id = req.params.id;
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    db.get('SELECT * FROM transactions WHERE id = ? AND userId = ?', [id, req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Transaction not found for this user' });
        }
        res.json(row);
    });
};

exports.updateTransaction = (req, res) => {
    const id = req.params.id;
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    const { type, category, amount, date, description } = req.body;
    const transaction = { type, category, amount, date, description };

    db.get('SELECT * FROM transactions WHERE id = ? AND userId = ?', [id, req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Transaction not found for this user' });
        }

        db.run('UPDATE transactions SET type = ?, category = ?, amount = ?, date = ?, description = ? WHERE id = ?', 
        [transaction.type, transaction.category, transaction.amount, transaction.date, transaction.description, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({updatedID: id , message: 'Transaction updated successfully' });
        });
    });
};

exports.deleteTransactionById = (req, res) => {
    const id = req.params.id;

    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid transaction ID' });
    }

    db.get('SELECT * FROM transactions WHERE id = ? AND userId = ?', [id, req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Transaction not found for this user' });
        }

        db.run('DELETE FROM transactions WHERE id = ?', [id], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Transaction deleted successfully' });
        });
    });
};

exports.transactionSummary = (req, res) => {
    const { startDate, endDate, id } = req.query; 
    const userId = req.user.id;

    if (startDate && isNaN(Date.parse(startDate))) {
        return res.status(400).json({ error: 'Invalid start date format. Use YYYY-MM-DD.' });
    }
    if (endDate && isNaN(Date.parse(endDate))) {
        return res.status(400).json({ error: 'Invalid end date format. Use YYYY-MM-DD.' });
    }

    let query = `
        SELECT type, SUM(amount) AS total 
        FROM transactions 
        WHERE userId = ? 
    `;
    const params = [userId];

    if (id) {
        query += 'AND id = ? ';
        params.push(id);
    }

    if (startDate && endDate) {
        query += 'AND date BETWEEN ? AND ? ';
        params.push(startDate, endDate);
    } else {
        if (startDate) {
            query += 'AND date >= ? ';
            params.push(startDate);
        }
        if (endDate) {
            query += 'AND date <= ? ';
            params.push(endDate);
        }
    }

    query += 'GROUP BY type';

    console.log('Executing transaction summary query:', query);
    console.log('With parameters:', params);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error during transaction summary:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transactions found for the specified user.' });
        }
        res.json(rows);
    });
};

exports.getMonthlyReport = (req, res) => {
    const userId = req.user.id; 

    const query = `
        SELECT strftime('%Y-%m', date) AS month, category, SUM(amount) AS total
        FROM transactions
        WHERE userId = ?
        GROUP BY month, category
        ORDER BY month DESC, category
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error('Database error during monthly report:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No transactions found for the specified user.' });
        }
        res.json(rows);
    });
};

