const express = require('express');
const { 
  addYear, 
  addOrUpdateLabel, 
  getLabelsForYear, 
  getUniqueYears, 
  updateLabel, 
  appendPdfs,
  getPdfsForYearAndLabel,
  getPdfStats,
  getPdfs
} = require('../controllers/pdfController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Define storage options for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname); 
        const originalName = path.basename(file.originalname, ext); 
        const meaningfulName = `${originalName}-${uniqueSuffix}${ext}`; 
        cb(null, meaningfulName);
    }
});


const upload = multer({ storage }); // Use the custom storage

// Route to add a new year
router.post('/add-year', addYear);

// Route to add or update labels for an existing year
router.post('/add-labels', addOrUpdateLabel);

// Route to get unique years
router.get('/unique-years', getUniqueYears);

// Route to get labels for a provided year
router.get('/:year/labels', getLabelsForYear);

// Route to append PDF files for a provided year and label
router.post('/append-pdfs', upload.single('pdf'), appendPdfs); // Change to single upload

// Route to update label for a provided year and label
router.put('/update-label', updateLabel);

// Route to get PDF files for a provided year and label
router.get('/:year/:label/pdfs', getPdfsForYearAndLabel);

router.get('/getpdfs', getPdfs);

router.get('/stats', getPdfStats); 

module.exports = router;
