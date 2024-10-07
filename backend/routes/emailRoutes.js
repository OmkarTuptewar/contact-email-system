const express = require('express');
const { 
  addEmails, 
  getEmailsByYearAndSeason, 
  getEmailsByYearSeasonAndLabel,
  appendEmails, // Import the function for appending/updating emails
  getUniqueEmailYears,
  getEmails,
  exportEmails
} = require('../controllers/emailController');


const router = express.Router();

// POST route for adding emails
router.post('/add', addEmails);

// GET route for fetching emails by year and season
router.get('/:year/:season', getEmailsByYearAndSeason);

// GET route for fetching emails by year, season, and label
router.get('/:year/:season/:label', getEmailsByYearSeasonAndLabel);

// PUT route for updating emails and label
router.put('/update', appendEmails);

// GET route for fetching unique years for emails
router.get('/season', getUniqueEmailYears);

// GET route for fetching all emails
router.get('/allemails', getEmails);

// GET route for exporting emails
router.get('/export', exportEmails);





module.exports = router;
