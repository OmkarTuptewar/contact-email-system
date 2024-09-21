import React from 'react';

const ContactTable = ({ contacts }) => {
  const columns = 4; // Define the number of columns per row

  // Group the contacts into rows of `columns` length
  const rows = [];
  for (let i = 0; i < contacts.length; i += columns) {
    rows.push(contacts.slice(i, i + columns));
  }

  return (
    <div className="overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Contacts Table:</h3>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            {Array(columns).fill(null).map((_, index) => (
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
                  Array(columns - row.length).fill(null).map((_, emptyIndex) => (
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
              <td colSpan={columns} className="py-2 px-4 text-center text-gray-400">
                No contacts available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
