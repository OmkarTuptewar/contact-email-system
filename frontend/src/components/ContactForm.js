import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaSave } from 'react-icons/fa';

const ContactForm = ({ year, season, selectedLabel, setContacts, fetchLabels }) => {
  const [label, setLabel] = useState('');
  const [contactList, setContactList] = useState('');
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedLabel) {
      setLabel(selectedLabel);
    } else {
      setLabel('');
    }
  }, [selectedLabel]);

  const handleLabelEdit = () => {
    setIsEditingLabel(true);
  };

  const handleSaveLabel = async () => {
    if (!label.trim()) {
      toast.error('Label name cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/contacts/update-label`, {
        year,
        season,
        oldLabel: selectedLabel,
        newLabel: label,
      });

      if (response.status === 200) {
        setIsEditingLabel(false);
        fetchLabels();
        toast.success('Label updated successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error updating label. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async () => {
    const contacts = contactList
      .split(/[\s,]+/)
      .map(contact => contact.trim())
      .filter(contact => contact !== '');

    if (!contacts.length) {
      toast.error('Please add at least one contact.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/contacts/add`, {
        year,
        season,
        label,
        contacts,
      });

      if (response.status === 200) {
        setContacts(response.data.contacts);
        setContactList('');
        fetchLabels();
        toast.success('Contacts added successfully!');
      }
    } catch (error) {
      console.log('Error:', error.response ? error.response.data : error.message);
      toast.error('Error adding contacts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-lg mb-4 text-gray-800">
        Add Contacts to:
        <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
          {isEditingLabel ? (
            <input
              type="text"
              className="border p-1 rounded"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          ) : (
            label
          )}
        </span>
        {isEditingLabel ? (
          <FaSave className="inline ml-2 cursor-pointer text-green-500" onClick={handleSaveLabel} />
        ) : (
          <FaEdit className="inline ml-2 cursor-pointer text-gray-500" onClick={handleLabelEdit} />
        )}
      </h3>

      <textarea
        className="border p-2 w-full mb-2 rounded"
        value={contactList}
        onChange={(e) => setContactList(e.target.value)}
        placeholder="Enter contacts separated by commas"
      />

      <button
        className="px-4 py-2 rounded text-white bg-red-500"
        onClick={handleAddContact}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Add Contact'}
      </button>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default ContactForm;
