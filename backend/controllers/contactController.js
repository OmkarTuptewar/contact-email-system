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
