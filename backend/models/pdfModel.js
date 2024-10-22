const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    year: {
        type: String,
        required: true,
    },
    label: {
        type: String,
    },
    pdfs: [{
        url: {
            type: String,
            
        },
        description: {
            type: String,
           
        }
    }]
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Pdf', pdfSchema);
