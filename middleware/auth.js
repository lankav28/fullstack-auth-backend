// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

    // Attach user ID to request object
    req.user = { id: decoded.id }; 

    next();
  } catch (err) {
    console.error('❌ JWT Error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
