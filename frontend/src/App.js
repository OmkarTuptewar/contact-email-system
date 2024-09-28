import React, { useEffect, useState } from 'react';
import AddYearButton from './components/AddYearButton';
import YearList from './components/YearList';
import LabelList from './components/LabelList';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';
import axios from 'axios';
import YearLabels from './components/YearLabels';

const App = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [labels, setLabels] = useState([]); // State for labels
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch contacts when year, season, or label changes
  useEffect(() => {
    if (selectedYear && selectedSeason && selectedLabel) {
      console.log("Fetching contacts for:", selectedYear, selectedSeason, selectedLabel);
      setLoading(true);
      setError('');
      axios.get(`http://localhost:5000/api/contacts/${selectedYear}/${selectedSeason}/${selectedLabel}`)
        .then((response) => {
          console.log("Contacts fetched:", response.data);
          const fetchedContacts = response.data.length > 0 ? response.data[0].contacts : [];
          setContacts(fetchedContacts);
        })
        .catch((error) => {
          console.error('Error fetching contacts:', error);
          setContacts([]);
          setError('Failed to fetch contacts. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setContacts([]);
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
      <div className="flex items-center justify-center bg-yellow h-24 shadow-lg">
        <h1 className="text-2xl font-extrabold text-gray-800 md:text-4xl">
          CONTACT MANAGEMENT - KNOWMYSLOTS
        </h1>
      </div>

      <div className="grid grid-cols-12 gap-2 p-2 h-screen bg-black">
        
        {/* First Column - Years Section */}
        <div className="col-span-2 bg-white border rounded-lg shadow-md p-6 ">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddYearButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <YearList selectedYear={selectedYear} selectedSeason={selectedSeason} />
          <YearLabels/>
        </div>

        {/* Second Column - Labels Section */}
        <div className="col-span-2 bg-gray-100 border rounded-lg shadow-md p-6 overflow-y-auto overflow-x-hidden">
          <LabelList year={selectedYear} season={selectedSeason} onSelectLabel={setSelectedLabel} labels={labels} fetchLabels={fetchLabels} />
        </div>

        {/* Third Column - Contacts Section */}
        <div className="col-span-8 bg-white border rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4">Contacts</h2>
          <ContactForm 
            year={selectedYear} 
            season={selectedSeason} 
            selectedLabel={selectedLabel}
            setContacts={setContacts} 
            fetchLabels={fetchLabels} // Ensure fetchLabels is available for contact form
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
