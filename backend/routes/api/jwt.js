const jwt = require('jsonwebtoken');

const JWT_SECRET = 'QSHC9Xjh80NRvAcqTMnBHJ5sBByvHMXu';

// { expiresIn: '1min' } //{ expiresIn: '1h' }
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
};