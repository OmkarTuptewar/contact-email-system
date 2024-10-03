import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer 
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications 

const ContactForm = ({ year, season, selectedLabel, setContacts, fetchLabels }) => {
  const [label, setLabel] = useState(''); // State for label input
  const [contactList, setContactList] = useState(''); // State for contact input
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  useEffect(() => {

    console.log("Selected Label:", selectedLabel);
    if (selectedLabel) {
      setLabel(selectedLabel.name || selectedLabel.label || ''); // Set the label name
      setIsEditing(true); // Set editing mode to true when a label is selected
    } else {
      setLabel(''); // Clear label if no label is selected
      setIsEditing(false); // Reset editing mode when no label is selected
    }
  }, [selectedLabel]);

  const handleSubmit = async () => {
    const contacts = contactList.split(',').map(contact => contact.trim());
    const numericYear = parseInt(year);
    try {
      const response = await axios.post('http://localhost:5000/api/contacts/add', {
        year: numericYear,
        season,
        label,
        contacts,
      });
  
      console.log("Response from server:", response.data); // Log response data
  
      if (response.status === 200) { // Check if the response status is 200
        setContacts(response.data.contacts);
        setContactList('');
        fetchLabels();
        toast.success('Contacts added successfully!'); // Show success toast 
      } else {
        toast.error('Unexpected response from server.'); // Handle unexpected status 
      }
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error.message); // Log error details
      toast.error('Error adding contacts. Please try again.'); // Show error toast 
    }
  };
  
  const handleUpdateContact = async () => {
    // Trim each contact and filter out empty strings
    const updatedContacts = contactList.split(',')
      .map(contact => contact.trim())
      .filter(contact => contact !== ''); // Remove any empty contacts
  
    const numericYear = parseInt(year); // Ensure year is a number
    const shouldUpdateContacts = updatedContacts.length > 0; // Check if there are valid contacts
  
    try {
      const response = await axios.put('http://localhost:5000/api/contacts/update', {
        year: numericYear,
        season,
        oldLabel: selectedLabel,  // Existing label
        newLabel: label || undefined, // Send newLabel only if it's not empty
        contacts: shouldUpdateContacts ? updatedContacts : undefined,  // Send contacts only if they exist
      });
  
      console.log('Updated Contacts:', response.data.updatedContact);
  
      // Update the contacts state only if contacts were updated
      if (shouldUpdateContacts) {
        setContacts(response.data.updatedContact.contacts); // Update the state with new contacts
      } else {
        // If only the label was updated, keep the previous contacts
        setContacts(prevContacts => prevContacts); // Maintain previous contacts
      }
  
      setContactList(''); // Clear the contact list after update
      fetchLabels();
      toast.success('Contacts updated successfully!'); // Show success toast
    } catch (error) {
      console.log('Error updating contacts:', error);
      toast.error('Error updating contacts. Please try again.'); // Show error toast
    }
  };
  
  return (
    <div>
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Add Contacts:   
        <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
          {selectedLabel}
        </span>
      </h3>
      
      {/* Label input field */}
      <input
        type="text"
        className="border p-2 w-full mb-2 rounded"
        value={label}
        onChange={(e) => setLabel(e.target.value)} // Allow manual editing
        placeholder="Enter label name"
      />

      {/* Contact input field */}
      <textarea
        className="border p-2 w-full mb-2 rounded"
        value={contactList}
        onChange={(e) => setContactList(e.target.value)}
        placeholder="Enter contacts separated by commas"
      />

      {/* Add/Update button */}
      <button
        className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-red-500' : 'bg-blue-500'}`}
        onClick={isEditing ? handleUpdateContact : handleSubmit} // Call appropriate function
      >
        {isEditing ? 'Append Contact' : 'Add Contact'}
      </button>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable /> 
    </div>
  );
};

export default ContactForm;
