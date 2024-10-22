import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { toast, ToastContainer } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications

const AddPdfButton = ({ onSelectYear }) => {
  const [year, setYear] = useState('');

  const handleAddYear = async () => {
    // Ensure the year is not empty
    if (!year) {
      toast.error('Please enter a year.'); // Show error toast if year is empty
      return;
    }
  
    try {
      // Log the year to be sent
      console.log("Sending year:", year);
  
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/pdf/add-year`, {
        year: parseInt(year), // Convert year to an integer
      });
  
      // Check for successful response
      if (response.status === 201) { // Check for the status code for created
        onSelectYear(year); // Call the onSelectYear function to update the year
        setYear(''); // Clear the input field
        toast.success('Year added successfully!'); // Show success toast
      } else {
        // This branch will rarely be hit unless you change the server response logic
        toast.error('Failed to add year. Unexpected response status.'); // Show error toast
      }
    } catch (error) {
      // Log the error response for debugging
      console.error('Error adding year:', error.response ? error.response.data : error.message);
      
      // Handle different error responses
      if (error.response && error.response.data) {
        toast.error(`Error: ${error.response.data.message || 'Please try again.'}`);
      } else {
        toast.error('Error adding year. Please try again.'); // Show error toast for catch block
      }
    }
  };
  
  return (
    <div className="max-w-md mx-auto p-4">
      <input
        type="text"
        placeholder="Enter year"
        className="border p-2 rounded mb-2 w-full"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto"
        onClick={handleAddYear} // Trigger the handleAddYear function on click
      >
        Add Year
      </button>
       
    </div>
  );
};

export default AddPdfButton;
