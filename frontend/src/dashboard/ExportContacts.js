import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ExportContacts = () => {
  const { auth } = useContext(AuthContext); // Get auth context

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/contacts/export`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add authorization header
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to export contacts');
      }

      // Create a blob from the response data
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Contacts.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting contacts:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded m-3"
    >
      <FontAwesomeIcon icon={faDownload} className="mr-2" />
      Export Database
    </button>
  );
};

export default ExportContacts;
