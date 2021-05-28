const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const isEmpty = require('is-empty');
const db = require('../db');

const {
  validateRegisterInput,
  validateLoginInput,
} = require('../utils/validateForm');

// @desc    Auth user and get password
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { errors, isValid } = validateLoginInput(req.body);

  const user = await db.query('SELECT * FROM users WHERE user_email = $1', [
    email,
  ]);

  if (user.rowCount > 0) {
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].user_password
    );

    if (validPassword) {
      res.json({
        _id: user.rows[0].user_id,
        name: user.rows[0].user_name,
        email: user.rows[0].user_email,
        token: generateToken(user.rows[0].user_id),
        created_at: user.rows[0].user_created_at,
      });
    } else {
      if (!errors.password) {
        errors.password = 'Password is incorrect';
        res.status(400);
      }
    }
  } else {
    if (!errors.email) {
      errors.email = 'Email not found';
      res.status(400);
    }
  }

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const { errors } = validateRegisterInput({
    name,
    email,
    password,
    confirmPassword,
  });
  const userExists = await db.query(
    'SELECT * FROM users WHERE user_email = $1',
    [email]
  );

  if (userExists.rowCount > 0) {
    errors.email = 'User email is already registered';

    res.status(400);
  }

  // Check validation
  if (!isEmpty(errors)) {
    return res.status(400).json(errors);
  }

  //Bcrypt the user password
  const saltRound = 10;
  const salt = await bcrypt.genSalt(saltRound);

  const bcryptpassword = await bcrypt.hash(password, salt);

  const created_at = new Date().toISOString();

  const user = await db.query(
    'INSERT INTO users(user_name, user_email, user_password, user_created_at) VALUES ($1, $2, $3, $4) returning *',
    [name, email, bcryptpassword, created_at]
  );

  if (user.rowCount > 0) {
    res.status(201).json({
      _id: user.rows[0].user_id,
      name: user.rows[0].user_name,
      email: user.rows[0].user_email,
      token: generateToken(user.rows[0].user_id),
      created_at: user.rows[0].user_created_at,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

module.exports = {
  authUser,
  registerUser,
};
