import React, { useState } from 'react';

const DashSearch = ({ contacts, emails, pdfdata }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTriggered, setSearchTriggered] = useState(false);

 
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
      setSearchTriggered(true); 
      return;
    }

    // Flatten all contacts and emails
    const allContacts = contacts.flatMap(contactDoc =>
      contactDoc.contacts.map(contactNumber => ({
        number: contactNumber,
        year: contactDoc.year,
        season: contactDoc.season,
        label: contactDoc.label,
        field: 'Contact Management', 
      }))
    );

    const allEmails = emails.flatMap(emailDoc =>
      emailDoc.emails.map(emailAddress => ({
        email: emailAddress,
        year: emailDoc.year,
        season: emailDoc.season,
        label: emailDoc.label,
        field: 'Email Management', 
      }))
    );

    // Flatten PDF data
    const allPdfs = pdfdata.flatMap(pdfDoc =>
      pdfDoc.pdfs.map(pdf => ({
        url: pdf.url,
        description: pdf.description,
        year: pdfDoc.year,
        label: pdfDoc.label,
        field: 'PDF Management', 
      }))
    );

  
    const results = [
      ...allContacts.filter(contact => contact.number.includes(searchTerm.trim())),
      ...allEmails.filter(email => email.email.includes(searchTerm.trim())),
      ...allPdfs.filter(pdf => pdf.description.includes(searchTerm.trim()))
    ];

    setFilteredResults(results);
    setSearchTriggered(true); 
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


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
            setSearchTriggered(false); 
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter contact number, email, or PDF description"
          aria-label="Search contact number, email, or PDF description"
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

    
      {searchTerm.trim() && !searchTriggered && (
        <div className="mt-3 text-gray-600 dark:text-gray-400 italic">
          Searching for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

    
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

     
      {searchTriggered && searchTerm.trim() && filteredResults.length === 0 && (
        <div className="mt-4 text-red-600 dark:text-red-400 font-semibold">
          No results found for "<span className="font-semibold">{searchTerm}</span>"
        </div>
      )}

     
      {filteredResults.length > 0 && (
        <ul
          className="mt-2 w-full bg-white dark:bg-gray-700 shadow-lg rounded-lg max-h-60 overflow-y-auto border border-gray-300 dark:border-gray-600 z-50"
          style={{
            top: '100%', 
            left: 0,     
            right: 0,    
          }}
        >
          {filteredResults.map((result, index) => (
            <li
              key={index}
              className="py-3 px-4 mb-2 bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {result.number || result.email || result.description}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {result.season || result.year} 
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Label: {result.label} <br />
                Field: {result.field}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashSearch;
