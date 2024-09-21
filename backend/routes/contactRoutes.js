const express = require('express');
const { addContacts, getContactsByYearAndSeason, getContactsByYearSeasonAndLabel } = require('../controllers/contactController');

const router = express.Router();

// POST route for adding a contact
router.post('/add', addContacts);

// GET route for fetching contacts by year and season
router.get('/:year/:season', getContactsByYearAndSeason);

// GET route for fetching contacts by year, season, and label
router.get('/:year/:season/:label', getContactsByYearSeasonAndLabel);

module.exports = router;
