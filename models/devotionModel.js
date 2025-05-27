const mongoose = require('mongoose');

const DevotionEntrySchema = new mongoose.Schema({
  week: {
    type: String, // e.g., "Week 20"
    required: true,
  },
  date: {
    type: Date, // e.g., "2025-05-23"
    required: true,
  },
  dayNumber: {
    type: Number, // e.g., 5 for "Day 5"
    required: true,
  },
  theme: {
    type: String, // e.g., "The Holy Spirit"
    required: true,
  },
  mainScripture: {
    type: String, // e.g., "John 14:16–17"
    required: true,
  },
  title: {
    type: String, // e.g., "The Spirit as Seal and Guarantee"
    required: true,
  },
  focusScripture: {
    type: String, // Scripture text
    required: true,
  },
  focusReference: {
    type: String, // e.g., "Ephesians 1:13–14"
    required: true,
  },
  reflection: {
    type: String, // Full reflection content
    required: true,
  },
  prayer: {
    type: String, // Prayer text
    required: true,
  },
  actionPoint: {
    type: String, // Suggested action
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DevotionEntry', DevotionEntrySchema);
