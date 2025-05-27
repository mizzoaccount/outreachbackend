const DevotionEntry = require('../models/devotionModel');

// @desc    Create a new devotion entry
// @route   POST /api/devotions
// @access  Public (you might want to add authentication later)
const createDevotion = async (req, res) => {
  try {
    const devotion = await DevotionEntry.create(req.body);
    res.status(201).json({
      success: true,
      devotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all devotion entries
// @route   GET /api/devotions
// @access  Public
const getDevotions = async (req, res) => {
  try {
    const devotions = await DevotionEntry.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: devotions.length,
      devotions
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single devotion entry
// @route   GET /api/devotions/:id
// @access  Public
const getDevotion = async (req, res) => {
  try {
    const devotion = await DevotionEntry.findById(req.params.id);
    
    if (!devotion) {
      return res.status(404).json({
        success: false,
        error: 'Devotion not found'
      });
    }
    
    res.status(200).json({
      success: true,
      devotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update devotion entry
// @route   PUT /api/devotions/:id
// @access  Public (add authentication later)
const updateDevotion = async (req, res) => {
  try {
    const devotion = await DevotionEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!devotion) {
      return res.status(404).json({
        success: false,
        error: 'Devotion not found'
      });
    }
    
    res.status(200).json({
      success: true,
      devotion
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete devotion entry
// @route   DELETE /api/devotions/:id
// @access  Public (add authentication later)
const deleteDevotion = async (req, res) => {
  try {
    const devotion = await DevotionEntry.findByIdAndDelete(req.params.id);
    
    if (!devotion) {
      return res.status(404).json({
        success: false,
        error: 'Devotion not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createDevotion,
  getDevotions,
  getDevotion,
  updateDevotion,
  deleteDevotion
};