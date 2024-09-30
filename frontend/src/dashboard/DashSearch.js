import React, { useState } from 'react';

const DashSearch = ({ contacts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Helper function to group contacts by year
  const groupContactsByYear = (contacts) => {
    return contacts.reduce((acc, contact) => {
      const { year } = contact;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(contact);
      return acc;
    }, {});
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      setSearchTriggered(true); // Trigger the "No contacts found" message
      return;
    }

    // Flatten all contacts with their associated year, season, and label
    const allContacts = contacts.flatMap(contactDoc =>
      contactDoc.contacts.map(contactNumber => ({
        number: contactNumber,
        year: contactDoc.year,
        season: contactDoc.season,
        label: contactDoc.label
      }))
    );

    // Filter contacts based on the search term
    const results = allContacts.filter(contact =>
      contact.number.includes(searchTerm.trim())
    );

    setFilteredResults(results);
    setSearchTriggered(true); // Search has been triggered
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Group filtered results by year
  const contactsByYear = groupContactsByYear(filteredResults);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 relative">
      <h2 className="text-xl font-semibold mb-2">Search Contacts</h2>
      
      <div className="flex">
        <input
          type="text"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setSearchTriggered(false); // Reset when typing
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter contact number"
          className="border border-gray-300 rounded-l p-2 flex-grow"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white rounded-r px-4"
        >
          Search
        </button>
      </div>

      {/* Live preview while typing */}
      {searchTerm.trim() && !searchTriggered && (
        <div className="mt-2 text-gray-600 italic">
          Searching for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

     {/* Display the number of search results */}
{filteredResults.length > 0 && (
  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-gray-700  max-h-60 overflow-y-auto">
    <div className="font-semibold text-lg">
      {filteredResults.length} contact{filteredResults.length > 1 ? 's' : ''} found
    </div>
    <div className="mt-2">
      {Object.keys(contactsByYear).map(year => (
        <div
          key={year}
          className="flex items-center justify-between py-2 px-3 bg-white border border-gray-200 rounded-lg shadow-sm mb-2"
        >
          <span className="font-medium text-gray-700">
            Year: <span className="text-blue-600">{year}</span>
          </span>
          <span className="text-blue-500 font-semibold">
            {contactsByYear[year].length} contact{contactsByYear[year].length > 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  </div>
)}


      {/* Display "No contacts found" after search is triggered */}
      {searchTriggered && searchTerm.trim() && filteredResults.length === 0 && (
        <div className="mt-2 text-red-600 font-semibold">
          No contacts found for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

      {/* Search results - positioned above other elements */}
      {filteredResults.length > 0 && (
        <ul
          className=" top-full left-0 right-0 z-50 bg-white shadow-lg rounded-lg mt-2 max-h-60 overflow-y-auto border border-gray-300"
        >
          {filteredResults.map((contact, index) => (
            <li
              key={index}
              className="py-3 px-4 mb-2 bg-gray-50 hover:bg-gray-100 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">{contact.number}</span>
                <span className="text-sm text-gray-600">{contact.year} • {contact.season}</span>
              </div>
              <div className="text-sm text-gray-600">Label: {contact.label}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashSearch;
