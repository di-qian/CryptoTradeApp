const jwt = require('jsonwebtoken');

const generateToken = (user_id) => {
  const payload = {
    user: user_id,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
};

module.exports = generateToken;
