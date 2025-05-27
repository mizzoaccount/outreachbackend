const express = require('express');
const router = express.Router();
const {
  createDevotion,
  getDevotions,
  getDevotion,
  updateDevotion,
  deleteDevotion
} = require('../controllers/devotionController');

// CRUD routes for devotion entries
router.route('/')
  .post(createDevotion)
  .get(getDevotions);

router.route('/:id')
  .get(getDevotion)
  .put(updateDevotion)
  .delete(deleteDevotion);

module.exports = router;