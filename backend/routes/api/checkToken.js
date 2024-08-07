const jwt = require('jsonwebtoken');
// Middleware to protect routes
// const JWT_SECRET = 'QSHC9Xjh80NRvAcqTMnBHJ5sBByvHMXu';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateJWT;