import React, { useEffect, useState } from 'react';
import AddYearButton from './components/AddYearButton';
import YearList from './components/YearList';
import LabelList from './components/LabelList';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';
import axios from 'axios';
import YearLabels from './components/YearLabels';
import { Link } from 'react-router-dom';

const App = () => {
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
      axios.get(`http://localhost:5000/api/contacts/${selectedYear}/${selectedSeason}/${selectedLabel}`)
        .then((response) => {
          const fetchedContacts = response.data.length > 0 ? response.data[0].contacts : [];
          setContacts(fetchedContacts);
        })
        .catch((error) => {
          console.error('Error fetching contacts:', error);
          // setContacts([]);
          setError('Failed to fetch contacts. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // setContacts([]);
    }
  }, [selectedYear, selectedSeason, selectedLabel]);

  // Fetch labels based on selected year and season
  const fetchLabels = async () => {
    if (!selectedYear || !selectedSeason) {
      setLabels([]); // Set labels to an empty array if year or season is not selected
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/contacts/${selectedYear}/${selectedSeason}`);
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
    <>
     <div className="flex items-center justify-between bg-gradient-to-r from-yellow-400  h-24 shadow-lg p-4 md:p-6 rounded-lg">
  <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
    CONTACT MANAGEMENT - KNOWMYSLOTS
  </h1>
  {/* Dashboard Button */}
  <Link to="/dashboard">
    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 ease-in-out shadow-md">
      Go to Dashboard
    </button>
  </Link>
</div>

      <div className="grid grid-cols-8 gap-2 p-2 h-screen bg-black">
        <div className="col-span-2 bg-white border rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddYearButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <YearList selectedYear={selectedYear} selectedSeason={selectedSeason} />
          <YearLabels onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} fetchLabels={fetchLabels}/>
        </div>

        <div className="col-span-2 bg-gray-100 border rounded-lg shadow-md p-6 overflow-y-auto overflow-x-hidden">
          <LabelList year={selectedYear} season={selectedSeason} onSelectLabel={setSelectedLabel} fetchLabels={fetchLabels}/>
        </div>

        <div className="col-span-4 bg-white border rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4">Contacts</h2>
          <ContactForm 
            year={selectedYear} 
            season={selectedSeason} 
            selectedLabel={selectedLabel}
            setContacts={setContacts} 
            fetchLabels={fetchLabels}
          />
          <div className="mt-4">
            {loading ? (
              <p>Loading contacts...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <ContactTable contacts={contacts} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
