const Event = require('../models/eventModel');
const cloudinary = require('cloudinary').v2;

// @desc    Create a new event
// @route   POST /api/events
// @access  Public (add authentication later)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      address,
      category,
      featured,
      registrationRequired,
      registrationLink,
      price,
      speakers,
      tags
    } = req.body;

    let imageUrl = '';

    // Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'events' },
        async (error, result) => {
          if (error) return res.status(500).json({ error: 'Image upload failed' });

          imageUrl = result.secure_url;

          // Create event after image is uploaded
          const newEvent = new Event({
            title,
            description,
            date: new Date(date),
            time,
            location,
            address,
            category,
            featured: featured === 'true',
            registrationRequired: registrationRequired === 'true',
            registrationLink,
            price,
            speakers: speakers.split(',').map(s => s.trim()),
            tags: tags.split(',').map(t => t.trim()),
            image: imageUrl
          });

          await newEvent.save();
          res.status(201).json(newEvent);
        }
      );

      // Pipe file buffer into Cloudinary upload stream
      require('streamifier').createReadStream(req.file.buffer).pipe(result);
    } else {
      // Handle case where no image is uploaded
      return res.status(400).json({ error: 'Event image is required' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Public (add authentication later)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    let imageUrl = event.image;
    
    // Upload new image to Cloudinary if exists
    if (req.file) {
      // Delete old image from Cloudinary if exists
      if (event.image) {
        const publicId = event.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        async (error, result) => {
          if (error) throw new Error('Image upload failed');
          return result;
        }
      ).end(req.file.buffer);
      
      imageUrl = result.secure_url;
    }

    // Parse speakers and tags from JSON strings
    const speakers = req.body.speakers ? JSON.parse(req.body.speakers) : event.speakers;
    const tags = req.body.tags ? JSON.parse(req.body.tags) : event.tags;

    const updateData = {
      title: req.body.title || event.title,
      description: req.body.description || event.description,
      date: req.body.date ? new Date(req.body.date) : event.date,
      time: req.body.time || event.time,
      location: req.body.location || event.location,
      address: req.body.address || event.address,
      category: req.body.category || event.category,
      featured: req.body.featured ? req.body.featured === 'true' : event.featured,
      image: imageUrl,
      speakers,
      registrationRequired: req.body.registrationRequired ? 
        req.body.registrationRequired === 'true' : event.registrationRequired,
      registrationLink: req.body.registrationLink || event.registrationLink,
      price: req.body.price || event.price,
      tags
    };

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      event: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Public (add authentication later)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (event.image) {
      const publicId = event.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
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
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
};