const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    featured: { type: Boolean, default: false },
    image: { type: String, default: null },
    speakers: [{ type: String }],
    registrationRequired: { type: Boolean, default: false },
    registrationLink: { type: String, default: null },
    price: { type: String, default: "Free" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

module.exports = Event;
