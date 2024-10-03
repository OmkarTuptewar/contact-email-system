const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
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
  emails: {
    type: [String], // Array of email strings without validation
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Email', emailSchema);
