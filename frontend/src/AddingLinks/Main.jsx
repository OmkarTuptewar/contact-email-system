import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AddLinkButton from './AddLinkButton';
import LinkForm from './LinkForm';
import LinkList from './LinkList';
import LinkLabels from './LinkLabels';
import LinkLabelList from './LinkLabelList';
import LinkTable from './LinkTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Dropdown from '../components/Dropdown';

const Main = () => {
  const { auth, logout } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [links, setLinks] = useState([]); 
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLinks = async () => {
      if (selectedYear && selectedLabel) {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/link/${selectedYear}/${selectedLabel}/links`);
          setLinks(response.data); 
        } catch (error) {
          console.error('Error fetching links:', error);
          setError('Failed to fetch links. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLinks([]); 
      }
    };
  
    fetchLinks();
  }, [selectedYear, selectedLabel]);
  
  const fetchLabels = async () => {
    if (!selectedYear) {
      setLabels([]); 
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/link/${selectedYear}/labels`);
      setLabels(response.data); 
    } catch (error) {
      console.error('Error fetching labels:', error);
      setError('Failed to fetch labels. Please try again.');
    }
  };

  const updateSelectedLabel = (newLabel) => {
    setSelectedLabel(newLabel); // Update the selected label
  };

  return (
    <div>
  <div className="flex items-center justify-between bg-gray-800 h-24 shadow-md p-4 md:p-6 rounded-lg">
    <Link to="/Contact" className="text-gray-300 hover:text-gray-100 transition-colors">
      <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
    </Link>

    <h1 className="text-xl md:text-2xl font-bold text-white">
      LINK MANAGEMENT - KNOWMYSLOTS
    </h1>

    <div className="flex flex-col md:flex-row items-center space-x-4">
      {/* Dropdown Menu */}
      <Dropdown />
      {/* Welcome Message */}
      <p className="text-gray-200 text-lg font-semibold mb-1">
        Welcome, {auth.username}!
      </p>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
      >
        Logout
      </button>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 h-screen bg-gray-50">
    <div className="col-span-1 md:col-span-2 bg-white border rounded-lg shadow-md p-6">
      <h2 className="font-bold text-lg mb-4 text-gray-800">Years</h2>
      <AddLinkButton onSelectYear={setSelectedYear} />
      <LinkList selectedYear={selectedYear} />
      <LinkLabels onSelectYear={setSelectedYear} fetchLabels={fetchLabels} />
    </div>

    <div className="col-span-1 md:col-span-2 bg-gray-200 border rounded-lg shadow-md p-6 overflow-y-auto">
      <LinkLabelList 
        year={selectedYear} 
        onSelectLabel={setSelectedLabel} 
        labels={labels} 
        fetchLabels={fetchLabels} 
      />
    </div>

    <div className="col-span-1 md:col-span-4 bg-white border rounded-lg shadow-md p-6 flex flex-col">
      <h2 className="font-bold text-lg mb-4 text-gray-800">Links</h2>
      <LinkForm 
        year={selectedYear} 
        selectedLabel={selectedLabel} 
        setLinks={setLinks} 
        fetchLabels={fetchLabels} 
        updateSelectedLabel={updateSelectedLabel} // Pass the update function
      />

      {auth.role === 'admin' && (
        <div className="mt-4">
          {loading ? (
            <p className="text-gray-600">Loading links...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <LinkTable links={links} />
          )}
        </div>
      )}
    </div>
  </div>
</div>

  );
};

export default Main;
