const express = require('express');
const { 
  addEmails, 
  getEmailsByYearAndSeason, 
  getEmailsByYearSeasonAndLabel,
  getUniqueEmailYears,
  getEmails,
  exportEmails,
  updateLabel,
  addEmailLabel
} = require('../controllers/emailController');


const router = express.Router();

// POST route for adding emails
router.post('/add', addEmails);

// GET route for fetching emails by year and season
router.get('/:year/:season', getEmailsByYearAndSeason);

// GET route for fetching emails by year, season, and label
router.get('/:year/:season/:label', getEmailsByYearSeasonAndLabel);


// GET route for fetching unique years for emails
router.get('/season', getUniqueEmailYears);

// GET route for fetching all emails
router.get('/allemails', getEmails);

// GET route for exporting emails
router.get('/export', exportEmails);

router.put('/update-label', updateLabel);

router.post('/add-label', addEmailLabel);


module.exports = router;
