import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ year, season, setContacts }) => {
  const [label, setLabel] = useState(''); // State for label input
  const [contactList, setContactList] = useState('');

  const handleSubmit = async () => {
    const contacts = contactList.split(',').map(contact => contact.trim());
    const numericYear = parseInt(year); // Ensure year is a number
    try {
      const response = await axios.post('http://localhost:5000/api/contacts/add', {
        year: numericYear,
        season,
        label,
        contacts,
      });
      setContacts(response.data.contacts);
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Add Contacts</h3>
      
      {/* Label input field */}
      <input
        type="text"
        className="border p-2 w-full mb-2 rounded"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Enter label name"
      />

      {/* Contact input field */}
      <textarea
        className="border p-2 w-full mb-2 rounded"
        value={contactList}
        onChange={(e) => setContactList(e.target.value)}
        placeholder="Enter contacts separated by commas"
      />

      {/* Submit button */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Update Data
      </button>
    </div>
  );
};

export default ContactForm;
