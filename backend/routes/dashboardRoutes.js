
const express = require('express');
const { getDashboardData, getContactsCategorised, getContactListWise } = require('../controllers/dashboardController'); // Adjust the path as necessary

const router = express.Router();

// Define the route for dashboard data
router.get('/data', getDashboardData);

router.get('/handlecontacts',getContactsCategorised );

router.get('/contactlist',getContactListWise);


module.exports = router;
