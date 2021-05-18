const asyncHandler = require('express-async-handler');
const db = require('../db');

const getAssets = asyncHandler(async (req, res) => {
  try {
    const results = await db.query(
      'SELECT * FROM profolio WHERE user_id = $1',
      [req.query.user_id]
    );

    res.status(200).json({
      status: 'success',
      results: results.rows.length,
      data: {
        cryptos: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const getAssetsById = asyncHandler(async (req, res) => {
  try {
    // const results = await db.query(
    //   'SELECT * from profolio INNER JOIN cryptoLibrary ON profolio.asset_name = cryptoLibrary.asset_name AND cryptoLibrary.ticker = $1',
    //   [req.params.id]
    // );

    const results = await db.query(
      'SELECT * from profolio WHERE user_id = $2 AND profolio.asset_ticker = $1',
      [req.params.id, req.query.user_id]
    );

    if (results.rows.length > 0) {
      res.status(200).json({
        status: 'success',
        data: {
          crypto: results.rows,
        },
      });
    } else {
      res.status(200).json({
        status: 'success',
        data: {
          crypto: [
            {
              not_own: true,
              asset_ticker: req.params.id,
            },
          ],
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const changeAssets = asyncHandler(async (req, res) => {
  try {
    const results = await db.query(
      'UPDATE profolio SET quantity=$3 WHERE user_id = $1 AND asset_name=$2 returning *',
      [req.body.user_id, req.body.asset_name, req.body.cash]
    );

    res.status(200).json({
      status: 'success',
      data: results.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

const changeAssetsById = asyncHandler(async (req, res) => {
  try {
    const results = await db.query(
      'UPDATE profolio SET quantity=$3, purchase_price=$4 WHERE user_id = $1 AND asset_name=$2 returning *',
      [
        req.body.user_id,
        req.body.asset_name,
        req.body.quantity,
        req.body.purchase_price,
      ]
    );

    res.status(200).json({
      status: 'success',
      data: results.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

const addAssetsById = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const results = await db.query(
      'INSERT INTO profolio(user_id, owner_email, asset_name, asset_ticker, quantity, purchase_price) VALUES ($1, $2, $3, $4, $5, $6) returning *',
      [
        req.body.user_id,
        req.body.owner_email,
        req.body.asset_name,
        req.body.asset_ticker,
        req.body.quantity,
        req.body.purchase_price,
      ]
    );

    res.status(201).json({
      status: 'success',
      data: {
        crypto: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const deleteAssetsById = asyncHandler(async (req, res) => {
  try {
    const results = await db.query(
      'DELETE FROM profolio WHERE user_id=$1 AND asset_ticker=$2',
      [req.body.user_id, req.params.id]
    );
    res.status(204).json({
      status: 'success',
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  getAssets,
  getAssetsById,
  addAssetsById,
  changeAssets,
  changeAssetsById,
  deleteAssetsById,
};
