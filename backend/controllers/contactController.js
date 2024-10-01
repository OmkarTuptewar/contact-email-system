const Contact = require('../models/contactModel');
const ExcelJS = require('exceljs');
// Add contacts for a specific year and label

exports.addContacts = async (req, res) => {
  const { year, season, label, contacts } = req.body;

  try {
    // Trim spaces only from the label
    const trimmedLabel = label.trim();

    // Remove spaces within each contact
    const cleanedContacts = contacts.map(contact => contact.replace(/\s+/g, ''));

    let contactEntry = await Contact.findOne({ year, season, label: trimmedLabel });

    if (contactEntry) {
      contactEntry.contacts = cleanedContacts;
      await contactEntry.save();
    } else {
      contactEntry = new Contact({ year, season, label: trimmedLabel, contacts: cleanedContacts });
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

exports.appendContacts = async (req, res) => {
  const { year, season, oldLabel, newLabel, contacts } = req.body; // oldLabel and newLabel for possible label change

  try {
    // Trim spaces from oldLabel and newLabel
    const trimmedOldLabel = oldLabel.trim();
    const trimmedNewLabel = newLabel ? newLabel.trim() : "";

    // Find the contact entry by year, season, and old label (trimmed)
    const contactEntry = await Contact.findOne({ year, season, label: trimmedOldLabel });

    if (!contactEntry) {
      return res.status(404).json({ message: 'Contact entry not found for the specified year, season, and label' });
    }

    // Check if newLabel is provided and not empty, then update the label (trimmed)
    if (trimmedNewLabel && trimmedNewLabel !== "") {
      contactEntry.label = trimmedNewLabel;
    }

    // Check if contacts is provided and not empty, then append the contacts to the existing list
    if (contacts && contacts.length > 0) {
      contactEntry.contacts = [...contactEntry.contacts, ...contacts]; // Append new contacts
    }

    // If both fields are empty, return an error indicating no update was made
    if (!newLabel && (!contacts || contacts.length === 0)) {
      return res.status(400).json({ message: 'No updates were provided' });
    }

    // Save the updated contact entry
    const updatedEntry = await contactEntry.save();

    res.status(200).json({
      message: 'Contacts appended successfully',
      updatedContact: updatedEntry,
    });
  } catch (error) {
    console.error('Error appending contacts:', error);
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

  exports.getContacts = async (req, res) => {
    try {
      const contacts = await Contact.find(); // Fetch all contact documents
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

 exports.exportContacts = async (req, res) => {
    try {
      const contacts = await Contact.find();
  
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Contacts');
  
      // Define columns
      worksheet.columns = [
        { header: 'ID', key: 'id', width: 25 },
        { header: 'Year', key: 'year', width: 10 },
        { header: 'Season', key: 'season', width: 15 },
        { header: 'Label', key: 'label', width: 20 },
        { header: 'Contacts', key: 'contacts', width: 30 },
      ];
  
      // Add rows
      contacts.forEach(contact => {
        worksheet.addRow({
          id: contact._id.toString(),
          year: contact.year,
          season: contact.season,
          label: contact.label,
          contacts: contact.contacts.join(', '),
        });
      });
  
      // Set response headers
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'Contacts.xlsx'
      );
  
      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error exporting contacts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  