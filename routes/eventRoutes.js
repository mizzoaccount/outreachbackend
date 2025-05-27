const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// CRUD routes for events
router.route('/')
  .post(upload.single('image'), createEvent)
  .get(getEvents);

router.route('/:id')
  .get(getEvent)
  .put(upload.single('image'), updateEvent)
  .delete(deleteEvent);

module.exports = router;