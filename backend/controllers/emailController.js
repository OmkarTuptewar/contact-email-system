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

    let emailEntry = await Email.findOne({ year, season, label: trimmedLabel });

    if (emailEntry) {
      emailEntry.emails = cleanedEmails;
      await emailEntry.save();
    } else {
      emailEntry = new Email({ year, season, label: trimmedLabel, emails: cleanedEmails });
      await emailEntry.save();
    }

    res.status(200).json(emailEntry);
  } catch (error) {
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

// Append emails and update label if necessary
exports.appendEmails = async (req, res) => {
  const { year, season, oldLabel, newLabel, emails } = req.body; // oldLabel and newLabel for possible label change

  try {
    // Trim spaces from oldLabel and newLabel
    const trimmedOldLabel = oldLabel.trim();
    const trimmedNewLabel = newLabel ? newLabel.trim() : "";

    // Find the email entry by year, season, and old label (trimmed)
    const emailEntry = await Email.findOne({ year, season, label: trimmedOldLabel });

    if (!emailEntry) {
      return res.status(404).json({ message: 'Email entry not found for the specified year, season, and label' });
    }

    // Check if newLabel is provided and not empty, then update the label (trimmed)
    if (trimmedNewLabel && trimmedNewLabel !== "") {
      emailEntry.label = trimmedNewLabel;
    }

    // Check if emails are provided and not empty, then append the emails to the existing list
    if (emails && emails.length > 0) {
      emailEntry.emails = [...emailEntry.emails, ...emails]; // Append new emails
    }

    // If both fields are empty, return an error indicating no update was made
    if (!newLabel && (!emails || emails.length === 0)) {
      return res.status(400).json({ message: 'No updates were provided' });
    }

    // Save the updated email entry
    const updatedEntry = await emailEntry.save();

    res.status(200).json({
      message: 'Emails appended successfully',
      updatedEmail: updatedEntry,
    });
  } catch (error) {
    console.error('Error appending emails:', error);
    res.status(500).json({ message: 'Server error', error });
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
