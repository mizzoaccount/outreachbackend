const Sermon = require('../models/sermonModel');
const fs = require('fs');
const path = require('path');

// Helper function to handle file upload
const handleFileUpload = (file, uploadPath) => {
  if (!file) return null;
  
  const uploadDir = path.join(__dirname, '../temp/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);

  fs.renameSync(file.path, filePath);

  return {
    filename: fileName,
    path: `/uploads/${fileName}`,
    originalName: file.originalname,
    size: file.size
  };
};

// Create sermon
const createSermon = async (req, res) => {
  try {
    const { title, description, date, speaker, scripture, mediaType, videoId, transcript, studyGuide } = req.body;
    
    const sermonData = {
      title,
      description,
      date: new Date(date),
      speaker,
      scripture,
      mediaType,
      videoId: mediaType === 'youtube' ? videoId : null,
      transcript: transcript === 'true',
      studyGuide: studyGuide === 'true'
    };

    if (mediaType === 'pdf' && req.files?.pdfFile) {
      sermonData.pdfFile = handleFileUpload(req.files.pdfFile[0], 'temp/uploads');
    }

    const sermon = await Sermon.create(sermonData);
    
    res.status(201).json({
      success: true,
      sermon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all sermons
const getSermons = async (req, res) => {
  try {
    const sermons = await Sermon.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: sermons.length,
      sermons
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get single sermon
const getSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findById(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({
        success: false,
        error: 'Sermon not found'
      });
    }
    
    res.status(200).json({
      success: true,
      sermon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update sermon
const updateSermon = async (req, res) => {
  try {
    const { id } = req.params;
    const sermon = await Sermon.findById(id);
    
    if (!sermon) {
      return res.status(404).json({
        success: false,
        error: 'Sermon not found'
      });
    }

    const { title, description, date, speaker, scripture, mediaType, videoId, transcript, studyGuide } = req.body;
    
    const updateData = {
      title,
      description,
      date: new Date(date),
      speaker,
      scripture,
      mediaType,
      videoId: mediaType === 'youtube' ? videoId : null,
      transcript: transcript === 'true',
      studyGuide: studyGuide === 'true'
    };

    if (mediaType === 'pdf' && req.files?.pdfFile) {
      // Delete old file if exists
      if (sermon.pdfFile?.path) {
        const oldFilePath = path.join(__dirname, '../temp', sermon.pdfFile.path);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.pdfFile = handleFileUpload(req.files.pdfFile[0], 'temp/uploads');
    } else if (mediaType !== 'pdf') {
      updateData.pdfFile = null;
    }

    const updatedSermon = await Sermon.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      sermon: updatedSermon
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Delete sermon
const deleteSermon = async (req, res) => {
  try {
    const sermon = await Sermon.findByIdAndDelete(req.params.id);
    
    if (!sermon) {
      return res.status(404).json({
        success: false,
        error: 'Sermon not found'
      });
    }

    // Delete associated PDF file if exists
    if (sermon.pdfFile?.path) {
      const filePath = path.join(__dirname, '../temp', sermon.pdfFile.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
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
  createSermon,
  getSermons,
  getSermon,
  updateSermon,
  deleteSermon
};