const express = require('express');
const router = express.Router();
const { makeDepositByEmail } = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware.js');

router.route('/').post(makeDepositByEmail);

module.exports = router;
