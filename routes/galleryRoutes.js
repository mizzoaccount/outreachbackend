const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

// CRUD routes for gallery
router.route('/')
  .post(upload.single('image'), createGalleryItem)
  .get(getGalleryItems);

router.route('/:id')
  .get(getGalleryItem)
  .put(upload.single('image'), updateGalleryItem)
  .delete(deleteGalleryItem);

module.exports = router;