const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  contacts: {
    type: [String], // No validation on contacts
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Contact', contactSchema);
