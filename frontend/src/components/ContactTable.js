import React from 'react';
import * as XLSX from 'xlsx';

const ContactTable = ({ contacts = [] }) => {
  console.log('Contacts prop in ContactTable:', contacts);
  const columns = 4; // Define the number of columns per row

  // Group the contacts into rows of `columns` length
  const rows = [];
  for (let i = 0; i < contacts.length; i += columns) {
    rows.push(contacts.slice(i, i + columns));
  }

  // Function to export the table to Excel
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
    <div className="overflow-x-auto max-h-[53vh] overflow-y-auto">
      
      <div className='flex justify-between items-center mb-4'>
      <h3 className="font-bold text-lg ">Contacts Table:</h3>
      <button
        onClick={exportToExcel}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Export Contacts to Excel
      </button>

      </div>
     
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {Array(columns)
              .fill(null)
              .map((_, index) => (
                <th
                  key={index}
                  className="text-left py-2 px-4 border-b border-r border-gray-300"
                >
                  Contact {index + 1}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {contacts.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((contact, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-2 px-4 border-b border-r border-gray-300"
                  >
                    {typeof contact === 'object' ? JSON.stringify(contact) : contact}
                  </td>
                ))}
                {/* Fill empty cells if row has less than 4 contacts */}
                {row.length < columns &&
                  Array(columns - row.length)
                    .fill(null)
                    .map((_, emptyIndex) => (
                      <td
                        key={`empty-${emptyIndex}`}
                        className="py-2 px-4 border-b border-r border-gray-300 text-gray-400"
                      >
                        N/A
                      </td>
                    ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns}
                className="py-2 px-4 text-center text-gray-400"
              >
                No contacts available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Export to Excel button */}
     
    </div>
  );
};

export default ContactTable;
