const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAssetsById,
  addAssetsById,
  changeAssets,
  changeAssetsById,
  deleteAssetsById,
} = require('../controllers/cryptoController');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').get(getAssets).put(protect, changeAssets);
router
  .route('/:id')
  .get(getAssetsById)
  .post(protect, addAssetsById)
  .put(protect, changeAssetsById)
  .delete(deleteAssetsById);

module.exports = router;
