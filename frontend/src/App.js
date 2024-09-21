import React, { useState } from 'react';
import AddYearButton from './components/AddYearButton';
import YearList from './components/YearList';
import LabelList from './components/LabelList';
import ContactForm from './components/ContactForm';
import ContactTable from './components/ContactTable';

const App = () => {
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [contacts, setContacts] = useState([]);

  return (
    <>
      <div className="flex items-center justify-center bg-yellow-100 h-24 shadow-lg">
        <h1 className="text-2xl font-extrabold  text-gray-800 md:text-4xl">
          CONTACT MANAGEMENT - KNOW MY SLOTS
        </h1>
      </div>
      <div className="grid grid-cols-12 gap-2 p-2  h-screen bg-yellow-50">
        
        {/* First Column - Years Section */}
        <div className="col-span-2 bg-white border rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddYearButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <YearList selectedYear={selectedYear} selectedSeason={selectedSeason} />
        </div>
  
        {/* Second Column - Labels Section */}
        <div className="col-span-2 bg-white border rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Labels :</h2>
          <LabelList year={selectedYear} season={selectedSeason} onSelectLabel={setSelectedLabel} />
        </div>
  
        {/* Third Column - Contacts Section */}
        <div className="col-span-8 bg-white border rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4">Contacts</h2>
          <ContactForm label={selectedLabel} year={selectedYear} season={selectedSeason} setContacts={setContacts} />
          <div className="mt-4">
            <ContactTable contacts={contacts} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
