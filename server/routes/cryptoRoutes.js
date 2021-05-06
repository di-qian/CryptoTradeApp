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

router.route('/').get(getAssets).put(changeAssets);
router
  .route('/:id')
  .get(getAssetsById)
  .post(addAssetsById)
  .put(changeAssetsById)
  .delete(deleteAssetsById);

module.exports = router;
