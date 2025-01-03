import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AddEmailButton from './AddEmailButton';
import EmailForm from './EmailForm';
import EmailList from './EmailList';
import EmailLabels from './EmailLabels';
import EmailLabelList from './EmailLabelList';
import EmailTable from './EmailTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Dropdown from '../components/Dropdown';
import { ToastContainer } from 'react-toastify';

const Main = () => {
  const { auth, logout } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [emails, setEmails] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch emails when year, season, and label change
  useEffect(() => {
    const fetchEmails = async () => {
      if (selectedYear && selectedSeason && selectedLabel) {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/email/${selectedYear}/${selectedSeason}/${selectedLabel}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`, // Include authorization token
            },
          });
          const fetchedEmails = response.data.length > 0 ? response.data[0].emails : [];
          setEmails(fetchedEmails);
        } catch (error) {
          console.error('Error fetching emails:', error);
          setError('Failed to fetch emails. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setEmails([]); // Clear emails if no label is selected
      }
    };

    fetchEmails();
  }, [selectedYear, selectedSeason, selectedLabel, auth.token]); // Added auth.token as a dependency

  // Fetch labels based on the selected year and season
  const fetchLabels = async () => {
    if (!selectedYear || !selectedSeason) {
      setLabels([]); // Reset labels when year or season is not selected
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/email/${selectedYear}/${selectedSeason}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Include authorization token
        },
      });
      setLabels(response.data); // Set labels in the state
    } catch (error) {
      console.error('Error fetching labels:', error);
      setError('Failed to fetch labels. Please try again.');
    }
  };

  return (
    <div>
      <ToastContainer/>
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-800 shadow-lg p-4 md:p-6 rounded-lg">
        <Link to="/Contact" className="text-white hover:text-gray-600 transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </Link>

        <h1 className="text-xl md:text-2xl font-bold text-white">
          EMAIL MANAGEMENT - KNOWMYSLOTS
        </h1>

        <div className="flex flex-col md:flex-row items-center space-x-4">
          {/* Dropdown Menu */}
          <Dropdown />
          
          {/* Welcome Message */}
          <p className="text-white text-lg font-semibold mb-1">
            Welcome, {auth.username}!
          </p>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 h-screen bg-gray-100">
        {/* Sidebar Section */}
        <div className="col-span-1 md:col-span-2 bg-white border rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddEmailButton onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} />
          <EmailList selectedYear={selectedYear} selectedSeason={selectedSeason} />
          <EmailLabels onSelectYear={setSelectedYear} onSelectSeason={setSelectedSeason} fetchLabels={fetchLabels} />
        </div>

        {/* Labels Section */}
        <div className="col-span-1 md:col-span-2 bg-gray-200 border rounded-lg shadow-md p-6 overflow-y-auto">
          <EmailLabelList 
            year={selectedYear} 
            season={selectedSeason} 
            onSelectLabel={setSelectedLabel} 
            labels={labels} 
            fetchLabels={fetchLabels} 
          />
        </div>

        {/* Emails Section */}
        <div className="col-span-1 md:col-span-4 bg-white border rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4">Emails</h2>
          <EmailForm 
            year={selectedYear} 
            season={selectedSeason} 
            selectedLabel={selectedLabel} 
            setEmails={setEmails} 
            fetchLabels={fetchLabels} 
          />

          {auth.role === 'admin' && (
            <div className="mt-4">
              {loading ? (
                <p className="text-gray-600">Loading emails...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <EmailTable emails={emails} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
