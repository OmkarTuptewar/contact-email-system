const express = require('express');
const { 
  addContacts, 
  getContactsByYearAndSeason, 
  getContactsByYearSeasonAndLabel,
  updateContacts,// Import the updateContacts function
  getUniqueYears
} = require('../controllers/contactController');

const router = express.Router();

// POST route for adding a contact
router.post('/add', addContacts);

// GET route for fetching contacts by year and season
router.get('/:year/:season', getContactsByYearAndSeason);

// GET route for fetching contacts by year, season, and label
router.get('/:year/:season/:label', getContactsByYearSeasonAndLabel);

// PUT route for updating contacts and label
router.put('/update', updateContacts);

router.get('/season', getUniqueYears); 

module.exports = router;
