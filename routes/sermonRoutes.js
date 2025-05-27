const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  createSermon,
  getSermons,
  getSermon,
  updateSermon,
  deleteSermon
} = require('../controllers/sermonController');

// Configure multer for file uploads
const upload = multer({ 
  dest: 'temp/uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// CRUD routes for sermons
router.route('/')
  .post(upload.fields([{ name: 'pdfFile', maxCount: 1 }]), createSermon)
  .get(getSermons);

router.route('/:id')
  .get(getSermon)
  .put(upload.fields([{ name: 'pdfFile', maxCount: 1 }]), updateSermon)
  .delete(deleteSermon);

module.exports = router;