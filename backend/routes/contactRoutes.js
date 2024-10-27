const express = require('express');
const { 
  addContacts, 
  getContactsByYearAndSeason, 
  getContactsByYearSeasonAndLabel,
 
  getUniqueYears,
  getContacts,
  exportContacts,
  updatelabel,
  addLabel
} = require('../controllers/contactController');

const router = express.Router();

// POST route for adding a contact
router.post('/add', addContacts);

// GET route for fetching contacts by year and season
router.get('/:year/:season', getContactsByYearAndSeason);

// GET route for fetching contacts by year, season, and label
router.get('/:year/:season/:label', getContactsByYearSeasonAndLabel);

router.put('/update-label', updatelabel);

router.get('/season', getUniqueYears); 

router.get('/allcontacts', getContacts);

router.post('/add-label', addLabel);

router.get('/export', exportContacts);

module.exports = router;
