const Pdf = require("../models/pdfModel"); // Adjust the path to your model

// Controller to add a new year with optional label and PDFs
const addYear = async (req, res) => {
  try {
    const { year, label, pdfs } = req.body;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    let existingPdf = await Pdf.findOne({ year });

    if (existingPdf) {
      return res.status(400).json({ message: `Year ${year} already exists.` });
    }

    const newPdf = new Pdf({
      year,
      label: label || "EDIT THIS LABEL", // Optional: default to an empty string if not provided
      pdfs: pdfs || [], // Optional: default to an empty array if not provided
    });

    const savedPdf = await newPdf.save();
    return res.status(201).json(savedPdf);
  } catch (error) {
    return res.status(500).json({ message: "Error adding new year", error });
  }
};

// Controller to add or update a label for a given year
const addOrUpdateLabel = async (req, res) => {
  try {
    const { year, label, pdfs = [] } = req.body;

    if (!year || !label) {
      return res.status(400).json({ message: "Year and label are required." });
    }

    let existingPdf = await Pdf.findOne({ year });

    if (!existingPdf) {
      const newPdf = new Pdf({
        year,
        label,
        pdfs: Array.isArray(pdfs) ? pdfs : [],
      });

      const savedPdf = await newPdf.save();
      return res.status(201).json(savedPdf);
    }

    const labelExists = await Pdf.findOne({ year, label });

    if (labelExists) {
      return res
        .status(400)
        .json({ message: `Label '${label}' already exists for year ${year}.` });
    }

    const newLabelPdf = new Pdf({
      year,
      label,
      pdfs: Array.isArray(pdfs) ? pdfs : [],
    });

    const savedLabelPdf = await newLabelPdf.save();
    return res.status(201).json(savedLabelPdf);
  } catch (error) {
    return res.status(500).json({ message: "Error adding/updating label", error });
  }
};

// Controller to get unique years
const getUniqueYears = async (req, res) => {
  try {
    const pdfs = await Pdf.find().sort({ createdAt: -1 });

    const uniqueYears = [...new Set(pdfs.map(pdf => pdf.year))];

    return res.status(200).json(uniqueYears);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving unique years", error });
  }
};

// Controller to get labels for a provided year
const getLabelsForYear = async (req, res) => {
  try {
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    const pdfsForYear = await Pdf.find({ year });

    if (!pdfsForYear.length) {
      return res.status(404).json({ message: `No labels found for year ${year}.` });
    }

    return res.status(200).json(pdfsForYear);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving labels", error });
  }
};




// Controller to get PDFs for a specific year and label
const getPdfsForYearAndLabel = async (req, res) => {
  try {
    const { year, label } = req.params;

    if (!year || !label) {
      return res.status(400).json({ message: "Year and label are required." });
    }

    const pdfEntry = await Pdf.findOne({ year, label });

    if (!pdfEntry) {
      return res
        .status(404)
        .json({
          message: `No PDFs found for year ${year} with label '${label}'.`,
        });
    }

    return res.status(200).json(pdfEntry.pdfs);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving PDFs", error });
  }
};

// Controller to update a label for a given year
const updateLabel = async (req, res) => {
  const { year, oldLabel, newLabel } = req.body;

  try {
    // Check if the old label exists
    const pdfEntry = await Pdf.findOne({ year, label: oldLabel });
    
    if (!pdfEntry) {
      return res
        .status(404)
        .json({
          message: `No entry found for year ${year} with label '${oldLabel}'.`,
        });
    }

    // Check if the new label already exists
    const existingLabel = await Pdf.findOne({ year, label: newLabel });
    
    if (existingLabel) {
      return res
        .status(400)
        .json({
          message: `Label '${newLabel}' already exists for year ${year}.`,
        });
    }

    // Update the label since it does not already exist
    pdfEntry.label = newLabel;
    await pdfEntry.save();

    return res.status(200).json(pdfEntry);
  } catch (error) {
    return res.status(500).json({ message: "Error updating label", error });
  }
};


const appendPdfs = async (req, res) => {
  const { year, label } = req.body;
  const { description } = req.body; // This will be a single description

  // Validate input
  if (!year || !label || !req.file) { // Check for a single file
    return res.status(400).json({ message: "Year, label, and a PDF file are required." });
  }

  // Find the existing PDF entry for the specified year and label
  const existingPdf = await Pdf.findOne({ year, label });

  // Check if the entry exists
  if (!existingPdf) {
    return res.status(404).json({ message: `No document found for year ${year} with label '${label}'.` });
  }

  // Push the new PDF entry into the pdfs array
  existingPdf.pdfs.push({
    url: `/uploads/${req.file.filename}`, // Store the path to the uploaded file
    description: description || 'No description' // Use provided description or default to 'No description'
  });

  try {
    await existingPdf.save();
    return res.status(200).json(existingPdf); // Respond with the updated PDF entry
  } catch (error) {
    console.error('Error saving PDF:', error);
    return res.status(500).json({ message: 'Failed to save PDF.' });
  }
};


const getPdfStats = async (req, res) => {
  try {
      // Fetch all PDFs from the database
      const pdfData = await Pdf.find({});

      // Initialize variables to store results
      let totalLabels = 0;
      let totalLinks = 0;
      let linksList = [];
      let uniqueLinksSet = new Set(); // To track unique links
      let yearsSet = new Set(); // To track unique years

      // Iterate over each PDF document
      pdfData.forEach(pdf => {
          // Add year to the set (set only stores unique values)
          yearsSet.add(pdf.year);

          // Count labels if they exist
          if (pdf.label) totalLabels++;

          // Iterate through each pdf link inside the pdfs array
          pdf.pdfs.forEach(pdfFile => {
              if (pdfFile.url) {
                  totalLinks++;
                  linksList.push(pdfFile.url);
                  uniqueLinksSet.add(pdfFile.url); // Add to the set for unique links
              }
          });
      });

      // Prepare the response
      const stats = {
          totalUniqueYears: yearsSet.size,
          totalLabels: totalLabels,
          totalLinks: totalLinks,
          totalUniqueLinks: uniqueLinksSet.size,
          totalLinksList: linksList,
          totalUniqueLinksList: Array.from(uniqueLinksSet), // Convert set back to an array
      };

      // Send the response
      res.status(200).json(stats);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
};

const getPdfs = async (req, res) => {
  try {
    const pdfs = await Pdf.find(); // Fetch all PDF documents
    res.status(200).json(pdfs); // Return the PDFs with a 200 status
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    res.status(500).json({ message: 'Server error' }); // Return a 500 error if something goes wrong
  }
};



module.exports = {
  addYear,
  addOrUpdateLabel,
  getLabelsForYear,
  getUniqueYears,
  appendPdfs,
  getPdfs,
  getPdfsForYearAndLabel,
  updateLabel,
  getPdfStats,
};
