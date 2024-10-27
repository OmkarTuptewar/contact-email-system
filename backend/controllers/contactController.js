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

    // Check if a contact entry for the same year, season, and label already exists
    let contactEntry = await Contact.findOne({ year, season, label: trimmedLabel });

    if (contactEntry) {
      // Append new contacts to the existing ones without filtering duplicates
      contactEntry.contacts = [...contactEntry.contacts, ...cleanedContacts];
      await contactEntry.save();
    } else {
      // Create a new contact entry if it doesn't exist
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

  exports.updatelabel= async (req, res) => {
    const { year, season, oldLabel, newLabel } = req.body;
  
    try {
      // Check if a contact with the same year, season, and newLabel already exists
      const existingContact = await Contact.findOne({ year, season, label: newLabel });
      if (existingContact) {
        return res.status(400).json({ error: 'A label with this name already exists for the same year and season.' });
      }
  
      // Update the label if no duplicate found
      const updatedContact = await Contact.findOneAndUpdate(
        { year, season, label: oldLabel }, // Find by year, season, and current label
        { label: newLabel }, // Update the label field
        { new: true } // Return the updated document
      );
  
      if (!updatedContact) {
        return res.status(404).json({ error: 'Contact label not found.' });
      }
  
      res.status(200).json({ message: 'Label updated successfully.', updatedContact });
    } catch (error) {
      console.error('Error updating label:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

   




exports.addLabel = async (req, res) => {
  const { year, season, label, contacts } = req.body;

  try {
    // Trim spaces only from the label
    const trimmedLabel = label.trim();

    // Check if a contact entry with the same year, season, and label already exists
    const existingLabel = await Contact.findOne({ year, season, label: trimmedLabel });

    if (existingLabel) {
      // Return a 400 error if a label already exists for the given year and season
      return res.status(400).json({ message: `The label "${label}" for the specified year and season already exists.` });
    }

    // Create a new contact entry
    const newContactEntry = new Contact({
      year,
      season,
      label: trimmedLabel,
      contacts:[]
    });

    await newContactEntry.save();

    res.status(201).json(newContactEntry); // Return the new contact entry with 201 Created status
  } catch (error) {
    console.error("Error adding label:", error);
    res.status(500).json({ message: 'Server error. Please try again later.', error });
  }
};


