const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.stripeSecretKey);
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const isEmpty = require('is-empty');
const db = require('../db');

// @desc    Make a deposit
// @route   POST /api/v1/transaction
// @access  Private
const makeDepositByEmail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.body.token;
    const cashDeposit = Number(req.body.cashDeposit);
    const charge = await stripe.charges.create({
      amount: cashDeposit * 100,
      currency: 'usd',
      source: id,
      description: `Making a deposit of $ ${cashDeposit}`,
    });

    const cash = req.body.cash + cashDeposit;
    console.log(req.body);
    const results = await db.query(
      'UPDATE profolio SET quantity=$3 WHERE user_id = $1 AND asset_name=$2 returning *',
      [req.body.user_id, req.body.asset_name, cash]
    );

    console.log(results.rows);
    res.status(200).json({
      status: 'success',
      data: results.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  makeDepositByEmail,
};
