import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Dropdown from './components/Dropdown'; // Import the Dropdown component
import AddYearButton from './components/AddYearButton';
import YearList from './components/YearList';
import LabelList from './components/LabelList';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';
import YearLabels from './components/YearLabels';

const App = () => {
  const { auth, logout } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch contacts when year, season, or label changes
  useEffect(() => {
    if (selectedYear && selectedSeason && selectedLabel) {
      setLoading(true);
      setError('');
      axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${selectedYear}/${selectedSeason}/${selectedLabel}`)
        .then((response) => {
          const fetchedContacts = response.data.length > 0 ? response.data[0].contacts : [];
          setContacts(fetchedContacts);
        })
        .catch((error) => {
          console.error('Error fetching contacts:', error);
          setError('Failed to fetch contacts. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedYear, selectedSeason, selectedLabel]);

  // Fetch labels based on selected year and season
  const fetchLabels = async () => {
    if (!selectedYear || !selectedSeason) {
      setLabels([]); // Set labels to an empty array if year or season is not selected
      return;
    }
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${selectedYear}/${selectedSeason}`);
      setLabels(response.data); // Set the labels in the state
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  // Call fetchLabels whenever year or season changes
  useEffect(() => {
    fetchLabels(); // Fetch labels whenever selectedYear or selectedSeason changes
  }, [selectedYear, selectedSeason]);

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-400 h-24 shadow-lg p-4 md:p-6 rounded-lg">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          CONTACT MANAGEMENT-KNOWMYSLOTS
        </h1>

        <div className="flex flex-col md:flex-row items-center space-x-4">
          {/* Dropdown Menu */}
          <Dropdown />

          {/* Logout Section */}
          <div className="flex flex-col md:flex-row items-center">
            <p className="text-gray-700 text-lg font-semibold">
              Welcome, {auth.username}!
            </p>
            <button
              onClick={logout}
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200 ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-2 p-2 bg-black rounded-lg">
        {/* Left Sidebar - Years & Seasons */}
        <div className="col-span-1 md:col-span-2 bg-white border rounded-lg shadow-md p-4">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddYearButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <YearList selectedYear={selectedYear} selectedSeason={selectedSeason} />
          <YearLabels onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} fetchLabels={fetchLabels} />
        </div>

        {/* Labels Section */}
        <div className="col-span-1 md:col-span-2 bg-gray-100 border rounded-lg shadow-md p-4 overflow-y-auto max-h-[98vh]">
          <LabelList year={selectedYear} season={selectedSeason} onSelectLabel={setSelectedLabel} fetchLabels={fetchLabels} />
        </div>

        {/* Contact Section */}
        <div className="col-span-1 md:col-span-4 bg-white border rounded-lg shadow-md p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-4">Contacts</h2>
          <ContactForm
            year={selectedYear}
            season={selectedSeason}
            selectedLabel={selectedLabel}
            setContacts={setContacts}
            fetchLabels={fetchLabels}
          />
          {auth.role === 'admin' && (
            <div className="mt-4">
              {loading ? (
                <p>Loading contacts...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <ContactTable contacts={contacts} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
