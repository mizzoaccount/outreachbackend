const mongoose = require('mongoose');

const sermonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },
    scripture: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['youtube', 'pdf', 'none'],
      default: 'none'
    },
    videoId: {
      type: String,
      default: null,
    },
    pdfFile: {
      filename: String,
      path: String,
      originalName: String,
      size: Number
    },
    transcript: {
      type: Boolean,
      default: false,
    },
    studyGuide: {
      type: Boolean,
      default: false,
    },
    downloads: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Sermon', sermonSchema);