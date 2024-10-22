const express = require('express');
const { addYear, addOrUpdateLabel, getLabelsForYear, getUniqueYears, appendLinks, getLinksForYearAndLabel, updateLabel, getLinkStats } = require('../controllers/LinkController');

const router = express.Router();

// Route to add a new year
router.post('/add-year', addYear);

// Route to add or update labels for an existing year
router.post('/add-labels', addOrUpdateLabel);

// Route to get unique years
router.get('/unique-years', getUniqueYears);

// Route to get labels for a provided year
router.get('/:year/labels', getLabelsForYear);

// Route to append links for a provided year and label
router.put('/append-links', appendLinks);

// Route to update label for a provided year and label
router.put('/update-label', updateLabel);

// Route to get links for a provided year and label
router.get('/:year/:label/links', getLinksForYearAndLabel);

router.get('/stats', getLinkStats); 


module.exports = router;
