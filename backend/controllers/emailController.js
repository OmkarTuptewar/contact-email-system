const Email = require('../models/emailModel');
const ExcelJS = require('exceljs');

// Add emails for a specific year, season, and label
exports.addEmails = async (req, res) => {
  const { year, season, label, emails } = req.body;

  try {
    // Trim spaces only from the label
    const trimmedLabel = label.trim();

    // Remove spaces within each email
    const cleanedEmails = emails.map(email => email.replace(/\s+/g, ''));

    // Check if an email entry for the same year, season, and label already exists
    let emailEntry = await Email.findOne({ year, season, label: trimmedLabel });

    if (emailEntry) {
      // Append new emails to the existing ones without filtering duplicates
      emailEntry.emails = [...emailEntry.emails, ...cleanedEmails];
      await emailEntry.save();
    } else {
      // Create a new email entry if it doesn't exist
      emailEntry = new Email({ year, season, label: trimmedLabel, emails: cleanedEmails });
      await emailEntry.save();
    }

    res.status(200).json(emailEntry);
  } catch (error) {
    console.error("Error adding emails:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};


// Get all labels and emails for a specific year and season
exports.getEmailsByYearAndSeason = async (req, res) => {
  const { year, season } = req.params;
  try {
    const emails = await Email.find({ year, season });
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get emails by year, season, and label
exports.getEmailsByYearSeasonAndLabel = async (req, res) => {
  const { year, season, label } = req.params;

  try {
    const emails = await Email.find({ year, season, label });
    if (emails.length === 0) {
      return res.status(404).json({ message: 'No emails found for the specified year, season, and label' });
    }
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emails', error });
  }
};

// Get unique seasons for emails
exports.getUniqueEmailYears = async (req, res) => {
  try {
    const years = await Email.distinct('season'); // Assuming 'year' is the field in your emails
    res.status(200).json(years);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ message: 'Error fetching seasons' });
  }
};

// Get all emails
exports.getEmails = async (req, res) => {
  try {
    const emails = await Email.find(); // Fetch all email documents
    res.status(200).json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export emails (e.g., to Excel)
exports.exportEmails = async (req, res) => {
  try {
    const emails = await Email.find(); // Fetch all emails

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Emails');

    // Add headers
    worksheet.columns = [
      { header: 'Year', key: 'year', width: 10 },
      { header: 'Season', key: 'season', width: 10 },
      { header: 'Label', key: 'label', width: 20 },
      { header: 'Emails', key: 'emails', width: 40 },
    ];

    // Add email data to the worksheet
    emails.forEach((email) => {
      worksheet.addRow({
        year: email.year,
        season: email.season,
        label: email.label,
        emails: email.emails.join(', '), // Join emails as a comma-separated string
      });
    });

    // Write the workbook to a file and send it as a download response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=emails.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateLabel = async (req, res) => {
  const { year, season, oldLabel, newLabel } = req.body;

  try {
      // Check if a contact with the same year, season, and newLabel already exists
      const existingContact = await Email.findOne({ year, season, label: newLabel });
      if (existingContact) {
          return res.status(400).json({ error: 'A label with this name already exists for the same year and season.' });
      }

      // Update the label if no duplicate found
      const updatedContact = await Email.findOneAndUpdate(
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

exports.addEmailLabel = async (req, res) => {
  const { year, season, label } = req.body;

  try {
    // Trim spaces only from the label
    const trimmedLabel = label.trim();

    // Check if a label entry with the same year, season, and label already exists
    const existingLabel = await Email.findOne({ year, season, label: trimmedLabel });

    if (existingLabel) {
      // Return a 400 error if a label already exists for the given year and season
      return res.status(400).json({ message: `The label "${trimmedLabel}" for the specified year and season already exists.` });
    }

    // Create a new email entry
    const newEmailEntry = new Email({
      year,
      season,
      label: trimmedLabel,
      emails: [] // Initialize with an empty array for emails
    });

    await newEmailEntry.save();

    res.status(201).json(newEmailEntry); // Return the new email entry with 201 Created status
  } catch (error) {
    console.error("Error adding email label:", error);
    res.status(500).json({ message: 'Server error. Please try again later.', error });
  }
};

