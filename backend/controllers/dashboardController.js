// controllers/dashboardController.js

const Contact = require('../models/contactModel'); // Ensure the correct path


exports.getDashboardData = async (req, res) => {
    try {
        const contacts = await Contact.find(); // Fetch all contacts

        // Initialize counters
        const totalYears = new Set();
        let totalSpring = 0;
        let totalFall = 0;
        let totalContacts = 0;
        const contactList = [];
        const contactsPerYear = {};
        const totalUniqueContacts = new Set();
        // Initialize label counters
        const totalLabels = new Set();
        const labelsPerYear = {};

        contacts.forEach(contact => {
            const year = contact.year; // Directly use the year field

            // Check if the season exists and split it safely
            const seasonParts = contact.season ? contact.season.split(' ') : [];
            const season = seasonParts.length > 1 ? seasonParts[1].toLowerCase() : null;

            // Add the year to the set for unique years
            totalYears.add(year);

            // Add label to totalLabels set
            if (contact.label) {
                totalLabels.add(contact.label);
            }

            // Update total contacts count
            if (Array.isArray(contacts)) {
                totalContacts += contact.contacts.length;
                contactList.push(...contact.contacts);
                 

                // Add unique contacts to the totalUniqueContacts set
                contact.contacts.forEach(contactName => {
                    // Assuming each contactInfo has a unique identifier, e.g., contactInfo.id
                    if (contactName) {

                 totalUniqueContacts.add(contactName); // Replace contactInfo.id with the unique field of your contact
 
                    }
                });
            }

            // Increment the season counters based on the valid season
            if (season === 'spring') {
                if (Array.isArray(contact.contacts)) {
                    totalSpring += contact.contacts.length;
                }
            } else if (season === 'fall') {
                if (Array.isArray(contact.contacts)) {
                    totalFall += contact.contacts.length;
                }
            }

            // Initialize year data if not already present
            if (!contactsPerYear[year]) {
                contactsPerYear[year] = { spring: 0, fall: 0 };
            }

            // Increment the count of contacts for the appropriate season for that year
            if (season && Array.isArray(contact.contacts)) {
                contactsPerYear[year][season] += contact.contacts.length;
            }

            // Initialize labelsPerYear
            if (!labelsPerYear[year]) {
                labelsPerYear[year] = { spring: new Set(), fall: new Set() };
            }

            // Add label to labelsPerYear
            if (season && contact.label) {
                labelsPerYear[year][season].add(contact.label);
            }
        });

        // Convert labelsPerYear sets to arrays and counts
        const formattedLabelsPerYear = {};
        Object.entries(labelsPerYear).forEach(([year, seasons]) => {
            formattedLabelsPerYear[year] = {
                spring: {
                    count: seasons.spring.size,
                    labels: Array.from(seasons.spring)
                },
                fall: {
                    count: seasons.fall.size,
                    labels: Array.from(seasons.fall)
                }
            };
        });

        res.status(200).json({
            totalYears: totalYears.size, // Total unique years
            totalSpring,
            totalFall,
            totalContacts,
            totalUniqueContacts: totalUniqueContacts.size, // Total unique contacts
            uniqueContactList: Array.from(totalUniqueContacts),
            contactList,
            totalLabels: totalLabels.size, // Total unique labels
            contactsPerYear,
            labelsPerYear: formattedLabelsPerYear
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




// Controller for handling contact categorization
exports.getContactsCategorised = async (req, res) => {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.find({});
        
        // Initialize the data structure for storing categorized contacts
        const categorizedData = {};
        const totalUniqueContacts = new Set();

        // Iterate over the contacts
        contacts.forEach(contact => {
            const { year, season, contacts: contactList = [] } = contact;

            if (!year) {
                console.warn('Contact missing year:', contact);
                return; // Skip this contact
            }

            const seasonParts = season ? season.split(' ') : [];
            const seasonKey = seasonParts.length > 1 ? seasonParts[1].toLowerCase() : null; // Get season safely

            // Initialize the year data if not already present
            if (!categorizedData[year]) {
                categorizedData[year] = {
                    spring: { totalUnique: new Set(), total: 0 },
                    fall: { totalUnique: new Set(), total: 0 },
                    totalUniquePerYear: 0 // Initialize totalUniquePerYear
                };
            }

            // Check if seasonKey is valid
            if (seasonKey && ['spring', 'fall'].includes(seasonKey)) {
                // Increment total contacts for the season
                categorizedData[year][seasonKey].total += contactList.length;

                // Add each contact to the unique set for the respective season
                contactList.forEach(contactName => {
                    categorizedData[year][seasonKey].totalUnique.add(contactName);
                    totalUniqueContacts.add(contactName); // Track total unique contacts
                });
            } else {
                console.warn(`Unexpected season value: ${seasonKey} for contact:`, contact);
            }
        });

        // Calculate the unique contacts for each year
        Object.keys(categorizedData).forEach(year => {
            const springUniqueContacts = categorizedData[year].spring.totalUnique;
            const fallUniqueContacts = categorizedData[year].fall.totalUnique;

            // Create a combined Set to ensure uniqueness across both seasons
            const combinedUniqueContacts = new Set([...springUniqueContacts, ...fallUniqueContacts]);

            // Set the unique counts for spring and fall
            categorizedData[year].spring.totalUnique = springUniqueContacts.size;
            categorizedData[year].fall.totalUnique = fallUniqueContacts.size;

            // Calculate total unique contacts for the year from the combined set
            categorizedData[year].totalUniquePerYear = combinedUniqueContacts.size;
        });

        // Prepare the final response object
        const response = {
            totalUniqueContacts: totalUniqueContacts.size,
            totalUnique: Array.from(totalUniqueContacts), // Convert Set to Array
            categorizedData
        };

        // Send the response back to the client
        res.status(200).json(response);
    } catch (err) {
        console.error('Error categorizing contacts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getContactListWise = async (req, res) => {
    try {
        // Fetch all contacts from the database
        const contacts = await Contact.find({});
        
        // Initialize the data structure for storing categorized contacts
        const categorizedContacts = {};

        // Iterate over the contacts
        contacts.forEach(contact => {
            const { year, season, contacts: contactList = [] } = contact;

            if (!year) {
                console.warn('Contact missing year:', contact);
                return; // Skip this contact
            }

            const seasonParts = season ? season.split(' ') : [];
            const seasonKey = seasonParts.length > 1 ? seasonParts[1].toLowerCase() : null; // Get season safely

            // Initialize the year data if not already present
            if (!categorizedContacts[year]) {
                categorizedContacts[year] = {
                    spring: [],
                    fall: []
                };
            }

            // Check if seasonKey is valid
            if (seasonKey && ['spring', 'fall'].includes(seasonKey)) {
                // Add each contact to the respective season array
                categorizedContacts[year][seasonKey].push(...contactList);
            } else {
                console.warn(`Unexpected season value: ${seasonKey} for contact:`, contact);
            }
        });

        // Prepare the final response object
        const response = {
            categorizedContacts
        };

        // Send the response back to the client
        res.status(200).json(response);
    } catch (err) {
        console.error('Error fetching contact lists:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



