const Contact = require('../models/contactModel');

// Add contacts for a specific year and label
exports.addContacts = async (req, res) => {
  const { year, season, label, contacts } = req.body;
  try {
    let contactEntry = await Contact.findOne({ year, season, label });
    
    if (contactEntry) {
      contactEntry.contacts = contacts;
      await contactEntry.save();
    } else {
      contactEntry = new Contact({ year, season, label, contacts });
      await contactEntry.save();
    }

    res.status(200).json(contactEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all labels and contacts for a specific year and season
exports.getContactsByYearAndSeason = async (req, res) => {
  const { year, season } = req.params;
  try {
    const contacts = await Contact.find({ year, season });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

 exports.getContactsByYearSeasonAndLabel = async (req, res) => {
  const { year, season, label } = req.params;

  try {
    const contacts = await Contact.find({ year, season, label });
    if (contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found for the specified year, season, and label' });
    }
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
};

exports.updateContacts = async (req, res) => {
  const { year, season, oldLabel, newLabel, contacts } = req.body; // oldLabel and newLabel for possible label change

  try {
    // Find the contact entry by year, season, and old label
    const contactEntry = await Contact.findOne({ year, season, label: oldLabel });

    if (!contactEntry) {
      return res.status(404).json({ message: 'Contact entry not found for the specified year, season, and label' });
    }

    // Check if newLabel is provided and not empty, then update the label
    if (newLabel && newLabel.trim() !== "") {
      contactEntry.label = newLabel;
    }

    // Check if contacts is provided and not empty, then update the contacts
    if (contacts && contacts.length > 0) {
      contactEntry.contacts = contacts;
    }

    // If both fields are empty, return an error indicating no update was made
    if (!newLabel && (!contacts || contacts.length === 0)) {
      return res.status(400).json({ message: 'No updates were provided' });
    }

    // Save the updated contact entry
    const updatedEntry = await contactEntry.save();

    res.status(200).json({
      message: 'Contact entry updated successfully',
      updatedContact: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating contacts:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



  exports.getUniqueYears = async (req, res) => {
    try {
      const years = await Contact.distinct('season'); // Assuming 'year' is the field in your contacts
      res.status(200).json(years);
    } catch (error) {
      console.error('Error fetching years:', error);
      res.status(500).json({ message: 'Error fetching years' });
    }
  };