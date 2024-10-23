const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; 

exports.registerUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (error, user) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (user) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (error) {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(201).json({ id: this.lastID, message: 'User registered successfully' });
        });
    });
};

exports.authenticateUser = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required!' });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (error, user) => {
        if (error || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    });
};
