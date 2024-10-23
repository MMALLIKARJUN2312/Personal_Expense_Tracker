const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; 

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = { id: decoded.id }; 
        next();
    });
};

module.exports = authenticateUser;
