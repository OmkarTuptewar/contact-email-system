const Link = require("../models/linkModel"); // Adjust the path to your model

// Controller to add a new year with optional label and links
const addYear = async (req, res) => {
  try {
    // Extract year, label, and links from the request body
    const { year, label, Links } = req.body;

    // Validate that the required 'year' field is provided
    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    let existingLink = await Link.findOne({ year });

    if (existingLink) {
      return res.status(400).json({ message: `Year ${year} already exists.` });
    }
    // Create a new Link document with the provided data
    const newLink = new Link({
      year,
      label: label || "Edit this label", 
      Links: Links || [], 
    });

    // Save the document to the database
    const savedLink = await newLink.save();

    // Send a response with the newly created Link
    return res.status(201).json(savedLink);
  } catch (error) {
    // Handle any errors during the process
    return res.status(500).json({ message: "Error adding new year", error });
  }
};

// Controller to add or create a new label for a given year
const addOrUpdateLabel = async (req, res) => {
  try {
    const { year, label, Links = [] } = req.body;

    // Validate that both year and label are provided
    if (!year || !label) {
      return res.status(400).json({ message: "Year and label are required." });
    }

    // Find the document with the given year
    let existingLink = await Link.findOne({ year });

    if (!existingLink) {
      // If year doesn't exist, create a new document
      const newLink = new Link({
        year,
        label,
        Links: Array.isArray(Links) ? Links : [],
      });

      const savedLink = await newLink.save();
      return res.status(201).json(savedLink);
    }

    // If the year exists, check if the label already exists for that year
    const labelExists = await Link.findOne({ year, label });

    if (labelExists) {
      return res
        .status(400)
        .json({ message: `Label '${label}' already exists for year ${year}.` });
    }

    // If the label does not exist, create a new entry
    const newLabelLink = new Link({
      year,
      label,
      Links: Array.isArray(Links) ? Links : [],
    });

    const savedLabelLink = await newLabelLink.save();
    return res.status(201).json(savedLabelLink);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding/updating label", error });
  }
};

const getUniqueYears = async (req, res) => {
    try {
      // Fetch links sorted by createdAt in descending order
      const links = await Link.find().sort({ createdAt: -1 });
  
      // Extract unique years from the sorted links
      const uniqueYears = [...new Set(links.map(link => link.year))];
  
      // Return the unique years, with the most recently added year first
      return res.status(200).json(uniqueYears);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving unique years", error });
    }
  };
  
  

const getLabelsForYear = async (req, res) => {
  try {
    const { year } = req.params;

    // Validate that the year is provided
    if (!year) {
      return res.status(400).json({ message: "Year is required." });
    }

    // Find all labels for the given year
    const linksForYear = await Link.find({ year });

    // Check if there are any links for the provided year
    if (!linksForYear.length) {
      return res
        .status(404)
        .json({ message: `No labels found for year ${year}.` });
    }

   
    return res.status(200).json(linksForYear);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving labels", error });
  }
};

const appendLinks = async (req, res) => {
  try {
    const { year, label, newLinks = [] } = req.body;

    // Validate that both year and label are provided
    if (!year && !label) {
      return res.status(400).json({ message: "Year and label are required." });
    }

    // Find the document with the given year and label
    const existingLink = await Link.findOne({ year, label });

    // If the document doesn't exist, return an error
    if (!existingLink) {
      return res
        .status(404)
        .json({
          message: `No document found for year ${year} with label '${label}'.`,
        });
    }

    // Append new links to the existing Links array
    existingLink.Links.push(...newLinks); // Use spread operator to append the new links

    // Save the updated document
    const updatedLink = await existingLink.save();
    return res.status(200).json(updatedLink);
  } catch (error) {
    return res.status(500).json({ message: "Error appending links", error });
  }
};

// Controller to get links for a provided year and label
const getLinksForYearAndLabel = async (req, res) => {
  try {
    const { year, label } = req.params;

    // Validate that both year and label are provided
    if (!year || !label) {
      return res.status(400).json({ message: "Year and label are required." });
    }

    // Find the document with the given year and label
    const linkEntry = await Link.findOne({ year, label });

    // Check if the link entry exists
    if (!linkEntry) {
      return res
        .status(404)
        .json({
          message: `No links found for year ${year} with label '${label}'.`,
        });
    }

    // Return the links associated with the found document
    return res.status(200).json(linkEntry.Links);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving links", error });
  }
};


// Controller to update the label
const updateLabel = async (req, res) => {
  const { year, oldLabel, newLabel } = req.body;

  try {
    // Find the document with the given year and old label
    const linkEntry = await Link.findOne({ year, label: oldLabel });

    if (!linkEntry) {
      return res.status(404).json({ message: `No entry found for year ${year} with label '${oldLabel}'.` });
    }

    // Check if the new label already exists for the same year
    const existingLabel = await Link.findOne({ year, label: newLabel });
    if (existingLabel) {
      return res.status(400).json({ message: `Label '${newLabel}' already exists for year ${year}.` });
    }

    // Update the label
    linkEntry.label = newLabel; // Update the label property as necessary
    await linkEntry.save();

    return res.status(200).json(linkEntry);
  } catch (error) {
    return res.status(500).json({ message: "Error updating label", error });
  }
};


const getLinkStats = async (req, res) => {
  try {
      // Fetch all links from the database
      const linkData = await Link.find({});

      // Initialize variables to store results
      let totalLabels = 0;
      let totalLinks = 0;
      let linksList = [];
      let uniqueLinksSet = new Set(); // To track unique links
      let yearsSet = new Set(); // To track unique years

      // Iterate over each link document
      linkData.forEach(link => {
          // Add year to the set (set only stores unique values)
          yearsSet.add(link.year);

          // Count labels if they exist
          if (link.label) totalLabels++;

          // Iterate through each link in the Links array
          link.Links.forEach(linkUrl => {
              if (linkUrl) {
                  totalLinks++;
                  linksList.push(linkUrl);
                  uniqueLinksSet.add(linkUrl); // Add to the set for unique links
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


module.exports = {
  addYear,
  addOrUpdateLabel,
  getLabelsForYear,
  getUniqueYears,
  appendLinks,
  getLinksForYearAndLabel,
  updateLabel,
  getLinkStats,
};
