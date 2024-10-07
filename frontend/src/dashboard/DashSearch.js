import React, { useState } from 'react';

const DashSearch = ({ contacts, emails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Helper function to group contacts and emails by year
  const groupResultsByYear = (results) => {
    return results.reduce((acc, result) => {
      const { year } = result;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(result);
      return acc;
    }, {});
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredResults([]);
      setSearchTriggered(true); // Trigger the "No contacts found" message
      return;
    }

    // Flatten all contacts and emails with their associated year, season, and label
    const allContacts = contacts.flatMap(contactDoc =>
      contactDoc.contacts.map(contactNumber => ({
        number: contactNumber,
        year: contactDoc.year,
        season: contactDoc.season,
        label: contactDoc.label,
      }))
    );

    // Flatten all emails with their associated year, season, and label
    const allEmails = emails.flatMap(emailDoc =>
      emailDoc.emails.map(emailAddress => ({
        email: emailAddress,
        year: emailDoc.year,
        season: emailDoc.season,
        label: emailDoc.label,
      }))
    );

    // Filter results based on the search term for both contacts and emails
    const results = [
      ...allContacts.filter(contact => contact.number.includes(searchTerm.trim())),
      ...allEmails.filter(email => email.email.includes(searchTerm.trim()))
    ];

    setFilteredResults(results);
    setSearchTriggered(true); // Search has been triggered
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Group filtered results by year
  const resultsByYear = groupResultsByYear(filteredResults);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6 relative transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Search Contacts</h2>
      
      <div className="flex flex-col sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setSearchTriggered(false); // Reset when typing
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter contact number or email"
          aria-label="Search contact number or email"
          className="border border-gray-300 dark:border-gray-700 rounded-md p-2 flex-grow bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />
        <button
          onClick={handleSearch}
          className="mt-2 sm:mt-0 sm:ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          aria-label="Search"
        >
          Search
        </button>
      </div>

      {/* Live preview while typing */}
      {searchTerm.trim() && !searchTriggered && (
        <div className="mt-3 text-gray-600 dark:text-gray-400 italic">
          Searching for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

      {/* Display the number of search results */}
      {filteredResults.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg shadow-sm text-gray-700 dark:text-gray-200 max-h-60 overflow-y-auto transition-colors duration-300">
          <div className="font-semibold text-lg mb-3">
            {filteredResults.length} result{filteredResults.length > 1 ? 's' : ''} found
          </div>
          <div className="space-y-2">
            {Object.keys(resultsByYear).map(year => (
              <div
                key={year}
                className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors duration-300"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Year: <span className="text-blue-600 dark:text-blue-400">{year}</span>
                </span>
                <span className="text-blue-500 dark:text-blue-300 font-semibold">
                  {resultsByYear[year].length} result{resultsByYear[year].length > 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display "No contacts found" after search is triggered */}
      {searchTriggered && searchTerm.trim() && filteredResults.length === 0 && (
        <div className="mt-4 text-red-600 dark:text-red-400 font-semibold">
          No results found for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

      {/* Search results - positioned above other elements */}
      {filteredResults.length > 0 && (
        <ul
          className="mt-2 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 z-50"
          style={{
            top: '100%', // Positions right below the search input
            left: 0,      // Align to the left edge of the container
            right: 0,     // Ensures it doesn't overflow to the right
          }}
        >
          {filteredResults.map((result, index) => (
            <li
              key={index}
              className="py-3 px-4 mb-2 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {result.number || result.email}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {result.season}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Label: {result.label}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};


export default DashSearch;
