const Gallery = require('../models/galleryModel');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// @desc    Create a new gallery item
// @route   POST /api/gallery
// @access  Public (add authentication later)
const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { 
            folder: 'gallery',
            resource_type: 'image' 
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });
    };

    const result = await uploadToCloudinary();

    const galleryItem = await Gallery.create({
      title: req.body.title,
      description: req.body.description,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        size: req.file.size
      }
    });

    res.status(201).json({
      success: true,
      galleryItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: galleryItems.length,
      galleryItems
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Public (add authentication later)
const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    const updateData = {
      title: req.body.title || galleryItem.title,
      description: req.body.description || galleryItem.description
    };

    // Handle image update if new file is provided
    if (req.file) {
      // First delete the old image from Cloudinary
      if (galleryItem.image?.public_id) {
        await cloudinary.uploader.destroy(galleryItem.image.public_id);
      }

      // Upload new image
      const uploadToCloudinary = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              folder: 'gallery',
              resource_type: 'image' 
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
      };

      const result = await uploadToCloudinary();
      
      updateData.image = {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        size: req.file.size
      };
    }

    const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      galleryItem: updatedItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Public (add authentication later)
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        error: 'Gallery item not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (galleryItem.image?.public_id) {
      await cloudinary.uploader.destroy(galleryItem.image.public_id);
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
  createGalleryItem,
  getGalleryItems,
  getGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};