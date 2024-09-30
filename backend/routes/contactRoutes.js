const express = require('express');
const { 
  addContacts, 
  getContactsByYearAndSeason, 
  getContactsByYearSeasonAndLabel,
  appendContacts,// Import the updateContacts function
  getUniqueYears,
  getContacts,
  exportContacts
} = require('../controllers/contactController');

const router = express.Router();

// POST route for adding a contact
router.post('/add', addContacts);

// GET route for fetching contacts by year and season
router.get('/:year/:season', getContactsByYearAndSeason);

// GET route for fetching contacts by year, season, and label
router.get('/:year/:season/:label', getContactsByYearSeasonAndLabel);

// PUT route for updating contacts and label
router.put('/update', appendContacts);

router.get('/season', getUniqueYears); 

router.get('/allcontacts', getContacts);

router.get('/export', exportContacts);

module.exports = router;
