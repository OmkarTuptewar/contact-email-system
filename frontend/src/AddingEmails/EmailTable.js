import React from 'react';
import * as XLSX from 'xlsx';

const EmailTable = ({ emails = [] }) => {
  console.log('Emails prop in EmailTable:', emails);
  const columns = 4; // Define the number of columns per row

  // Group the emails into rows of `columns` length
  const rows = [];
  for (let i = 0; i < emails.length; i += columns) {
    rows.push(emails.slice(i, i + columns));
  }

  // Function to export the table to Excel
  const exportToExcel = () => {
    // Create a new array to hold the worksheet data
    const worksheetData = [];
    
    // Prepare the header row
    const header = Array.from({ length: columns }, (_, index) => `Email ${index + 1}`);
    worksheetData.push(header);
    
    // Fill in the emails into the worksheet data
    for (let i = 0; i < emails.length; i++) {
      // Every `columns` emails, we start a new row
      const rowIndex = Math.floor(i / columns);
      if (!worksheetData[rowIndex + 1]) {
        worksheetData[rowIndex + 1] = [];
      }
      worksheetData[rowIndex + 1][i % columns] = emails[i]; // Place the email in the correct column
    }

    // Create worksheet from data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths (adjust the widths as needed)
    const columnWidths = Array.from({ length: columns }, () => ({ wpx: 150 })); // Set width of 150 pixels for each column
    worksheet['!cols'] = columnWidths;

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Emails');

    // Export the Excel file
    XLSX.writeFile(workbook, 'emails.xlsx');
  };

  return (
    <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
      <div className='flex justify-between items-center mb-4'>
        <h3 className="font-bold text-lg">Emails Table:</h3>
        <button
          onClick={exportToExcel}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Export Emails to Excel
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
                   {}
                </th> 
              ))}
          </tr>
        </thead>
        <tbody>
          {emails.length > 0 ? (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((email, colIndex) => (
                  <td
                    key={colIndex}
                    className="py-2 px-4 border-b border-r border-gray-300"
                  >
                    {email || 'N/A'} {/* Display email or 'N/A' if empty */}
                  </td>
                ))}
                {/* Fill empty cells if row has less than `columns` emails */}
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
                No emails available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmailTable;
