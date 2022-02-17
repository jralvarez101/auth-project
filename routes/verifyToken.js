const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../config/config.env' });

// CREATE MIDDLEWARE FUNCTION FOR PROTECTED ROUTES
module.exports = function (req, res, next) {
  // GET TOKEN FROM HEADER IF IT EXISTS
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access denied');
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
