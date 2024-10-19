const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    
  },
  Links: {
    type: [String], 
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Link', linkSchema);
