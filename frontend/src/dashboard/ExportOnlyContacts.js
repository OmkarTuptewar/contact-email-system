import React from 'react';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const ExportOnlyContacts = ({ contacts = [] }) => {
  // Function to export contacts to Excel
  const exportToExcel = () => {
    // Create a new array to hold the worksheet data
    const worksheetData = [];
    
    // Prepare the header row
    const header = Array.from({ length: 10 }, (_, index) => `Contact ${index + 1}`);
    worksheetData.push(header);
    
    // Fill in the contacts into the worksheet data
    for (let i = 0; i < contacts.length; i++) {
      // Every 10 contacts, we start a new row
      const rowIndex = Math.floor(i / 10);
      if (!worksheetData[rowIndex + 1]) {
        worksheetData[rowIndex + 1] = [];
      }
      worksheetData[rowIndex + 1][i % 10] = contacts[i]; // Place the contact in the correct column
    }

    // Create worksheet from data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths (adjust the widths as needed)
    const columnWidths = Array.from({ length: 10 }, () => ({ wpx: 110 })); // Set width of 150 pixels for each column
    worksheet['!cols'] = columnWidths;

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contacts');

    // Export the Excel file
    XLSX.writeFile(workbook, 'contacts.xlsx');
  };

  return (
    <div>
       
      <button   

        onClick={exportToExcel}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded m-3"
      >
         <FontAwesomeIcon icon={faDownload} className="mr-2" />
        Export Contacts 
      </button>
    </div>
  );
};

export default ExportOnlyContacts;
