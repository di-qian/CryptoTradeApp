const asyncHandler = require('express-async-handler');
const db = require('../db');

const getAssets = asyncHandler(async (req, res) => {
  try {
    const results = await db.query(
      'SELECT * FROM profolio INNER JOIN cryptoLibrary on profolio.asset_name = cryptoLibrary.asset_name'
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
    const results = await db.query(
      'SELECT * from profolio INNER JOIN cryptoLibrary ON profolio.asset_name = cryptoLibrary.asset_name AND cryptoLibrary.ticker = $1',
      [req.params.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        crypto: results.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const changeAssets = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const results = await db.query(
      'UPDATE profolio SET quantity=$3 WHERE owner_email = $1 AND asset_name=$2 returning *',
      [req.body.owner_email, req.body.asset_name, req.body.cash]
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
      'UPDATE profolio SET quantity=$3, purchase_price=$4 WHERE owner_email = $1 AND asset_name=$2 returning *',
      [
        req.body.owner_email,
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
    const results = await db.query(
      'INSERT INTO profolio(owner_email, asset_name, quantity, purchase_price) VALUES ($1, $2, $3, $4) returning *',
      [
        req.body.owner_email,
        req.params.id,
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
      'DELETE FROM profolio WHERE owner_email=$1 AND asset_name=$2',
      [req.body.owner_email, req.params.id]
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