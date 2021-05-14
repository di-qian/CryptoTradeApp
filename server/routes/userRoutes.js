const express = require('express');
const router = express.Router();
const { authUser, registerUser } = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser);
router.route('/login').post(authUser);

module.exports = router;
