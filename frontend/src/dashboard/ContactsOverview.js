import React, { useEffect, useState, useContext } from "react";
import ExportOnlyContacts from "./ExportOnlyContacts"; // Import your export component
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

const ContactsOverview = ({ labelsPerYear }) => {
  const { auth } = useContext(AuthContext); // Get auth context
  const [contactsPerYear, setContactsPerYear] = useState({});
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/contactlist`, {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add authorization header
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();

        // Extract categorized contacts directly from the fetched data
        setContactsPerYear(data.categorizedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [auth.token]); // Include auth.token in the dependency array

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-h-[62vh] flex items-center justify-center">
        <p className="text-gray-700 dark:text-gray-200">Loading Contacts Overview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-h-[62vh] flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-h-[62vh] overflow-hidden transition-colors duration-300">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Contacts Overview</h2>

      {/* Scrollable Content */}
      <div className="max-h-[50vh] overflow-y-auto space-y-6">
        {Object.entries(contactsPerYear).map(([year, seasons]) => (
          <div key={year} className="border-b border-gray-200 dark:border-gray-600 pb-4">
            <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-200">{year}</h3>
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Spring Section */}
              <div className="w-full sm:w-1/2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm transition-colors duration-300">
                <p className="font-semibold text-green-500 dark:text-green-400 mb-2">Spring</p>
                <p className="text-gray-700 dark:text-gray-300">Contacts: {seasons.spring.length}</p>
                <p className="text-gray-700 dark:text-gray-300">Labels: {labelsPerYear[year]?.spring.count || 0}</p>
                <ExportOnlyContacts
                  contacts={seasons.spring}
                  fileName={`${year}_spring_contacts.xlsx`}
                  className="mt-2"
                />
              </div>

              {/* Fall Section */}
              <div className="w-full sm:w-1/2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm transition-colors duration-300">
                <p className="font-semibold text-red-500 dark:text-red-400 mb-2">Fall</p>
                <p className="text-gray-700 dark:text-gray-300">Contacts: {seasons.fall.length}</p>
                <p className="text-gray-700 dark:text-gray-300">Labels: {labelsPerYear[year]?.fall.count || 0}</p>
                <ExportOnlyContacts
                  contacts={seasons.fall}
                  fileName={`${year}_fall_contacts.xlsx`}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsOverview;
