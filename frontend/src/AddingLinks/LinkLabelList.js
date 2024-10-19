import React, { useEffect, useState } from "react";
import axios from "axios";

// Modal component for adding a new label
const Modal = ({ isOpen, onClose, onSubmit, year }) => {
  const [newLabel, setNewLabel] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newLabel) {
      try {
        const requestBody = {
          year,
          label: newLabel,
          links: [], // Initialize with an empty links array
        };
        console.log("Sending request body:", requestBody); // Log the request body

        // Send the request to add a new label
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/link/add-labels`,
          requestBody
        );

        // Handle both 200 and 201 as success
        if (response.status === 200 || response.status === 201) {
          onSubmit(newLabel); // Call the onSubmit function with the new label
          setNewLabel(""); // Clear the input field
          onClose(); // Close the modal
        } else {
          console.error("Unexpected response:", response);
        }
      } catch (error) {
        console.error(
          "Error adding label:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  // Return null if the modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded shadow-lg z-10">
        <h2 className="font-bold text-lg mb-4">Add New Link Label</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter label name"
            required
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-300 p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Label
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main LinkLabelList component
const LinkLabelList = ({ year, onSelectLabel, fetchLabels }) => {
  const [labels, setLabels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch labels for the given year
  useEffect(() => {
    if (year) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/link/${year}/labels`)
        .then((response) => {
          console.log("Fetched labels:", response.data); // Log fetched labels to inspect structure
          setLabels(response.data);
        })
        .catch((err) => console.log(err));
    }
  }, [year, fetchLabels]);

  // Handle label click to select the label
  const handleLabelClick = (label) => {
    console.log("Label clicked:", label.label);
    onSelectLabel(label.label); // Pass the selected label to the parent component
  };

  // Add a new label to the list
  const handleAddLabel = (newLabel) => {
    // Create the new label object
    const newLabelObj = {
      name: newLabel,
      label: newLabel, // Ensure this matches the structure from the backend
      links: [],
    };
    setLabels((prevLabels) => [...prevLabels, newLabelObj]); // Add new label to state
  };

  return (
    <>
      <h3 className="font-bold text-xl mb-2 text-gray-700">
        Link Labels
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-32 bg-blue-500 text-white p-1 px-4 rounded-full"
          title="Add new label"
        >
          +
        </button>
      </h3>
      <div className="rounded-lg p-2 shadow-md w-full">
        <ul className="space-y-2">
          {labels.map((labelObj, idx) => (
            <li
              key={idx}
              className="cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg transition duration-300 ease-in-out 
        transform hover:bg-blue-200 hover:shadow-xl hover:scale-105 active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
        text-sm md:text-base lg:text-lg"
              onClick={() => handleLabelClick(labelObj)} // Pass the object
            >
              <span className="text-blue-600 font-medium truncate block">
                {labelObj.label || labelObj.name || "Unnamed Label"}
                {/* Ensure we fall back to 'name' if 'label' is missing */}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddLabel}
        year={year}
      />
    </>
  );
};

export default LinkLabelList;
  