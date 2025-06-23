const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';
const JWT_EXPIRES_IN = '8h';

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      type: user.type
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
