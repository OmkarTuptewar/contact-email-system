import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import { AuthContext } from './context/AuthContext';
import Dropdown from './components/Dropdown'; // Import the Dropdown component
import AddYearButton from './components/AddYearButton';
import YearList from './components/YearList';
import LabelList from './components/LabelList';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';
import YearLabels from './components/YearLabels';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const { auth, logout } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (selectedYear && selectedSeason && selectedLabel) {
      setLoading(true);
      setError('');
      axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${selectedYear}/${selectedSeason}/${selectedLabel}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
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
  }, [selectedYear, selectedSeason, selectedLabel, auth.token]); 

 
  const fetchLabels = async () => {
    if (!selectedYear || !selectedSeason) {
      setLabels([]); 
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/contacts/${selectedYear}/${selectedSeason}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setLabels(response.data); 
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };


  useEffect(() => {
    fetchLabels();
  }, [selectedYear, selectedSeason, auth.token]); 

  return (
    <div className="min-h-screen bg-gray-200">
      <ToastContainer/>
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-800 h-24 shadow-lg p-4 md:p-6 rounded-lg">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          CONTACT MANAGEMENT - KNOWMYSLOTS
        </h1>

        <div className="flex flex-col md:flex-row items-center space-x-4">
          {/* Dropdown Menu */}
          <Dropdown />

          {/* Logout Section */}
          <div className="flex flex-col md:flex-row items-center">
            <p className="text-white text-lg font-semibold">
              Welcome, {auth.username}!
            </p>
            <button
              onClick={logout}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 ml-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 bg-white rounded-lg shadow-md">
        {/* Left Sidebar - Years & Seasons */}
        <div className="col-span-1 md:col-span-2 bg-white border rounded-lg h-screen shadow-md p-4">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Years</h2>
          <AddYearButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <YearList selectedYear={selectedYear} selectedSeason={selectedSeason} />
          <YearLabels onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} fetchLabels={fetchLabels} />
        </div>

        {/* Labels Section */}
        <div className="col-span-1 md:col-span-2 bg-gray-200 border rounded-lg shadow-md p-6 overflow-y-auto ">
          <LabelList year={selectedYear} season={selectedSeason} onSelectLabel={setSelectedLabel} fetchLabels={fetchLabels} />
        </div>

        {/* Contact Section */}
        <div className="col-span-1 md:col-span-4 bg-white border rounded-lg shadow-md p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-4 text-gray-800">Contacts</h2>
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
                <p className="text-gray-600">Loading contacts...</p>
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
