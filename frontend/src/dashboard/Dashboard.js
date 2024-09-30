import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import DashGraph from "./DashGraph";
import DashSearch from "./DashSearch";
import ExportContacts from "./ExportContacts";
import ExportOnlyContacts from "./ExportOnlyContacts";
import UniqueContactGraph from "./UniqueContactGraph";
import ContactsOverview from "./ContactsOverview"; 

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalYears: 0,
    totalSpring: 0,
    totalFall: 0,
    totalContacts: 0,
    totalLabels: 0,
    contactList: [],
    uniqueContactList: [],
    contactsPerYear: {},
    labelsPerYear: {},
    totalUniqueContacts: 0,
  });

  const [contacts, setContacts] = useState([]); // State to hold the individual contacts
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/data");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };

    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/contacts/allcontacts");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    fetchContacts();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Back Arrow */}
      <Link to="/" className="absolute left-4 top-4">
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700 hover:text-gray-900 text-3xl" />
      </Link>

      {/* Dashboard Title and Description */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Dashboard
        </h1>
        <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto leading-relaxed">
          Welcome to your personalized dashboard! Manage your contacts, track activities, and access important tools all in one place.
        </p>
      </div>

      {/* Search Component */}
      <DashSearch contacts={contacts} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Years */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Years</h2>
          <p className="text-3xl font-bold text-green-500">{dashboardData.totalYears}</p>
          <ExportContacts />
        </div>

        {/* Total Seasons */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Contacts Each</h2>
          <div className="flex justify-between space-x-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600 mb-2">Spring</p>
              <p className="text-3xl font-extrabold text-gray-900">{dashboardData.totalSpring}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 mb-2">Fall</p>
              <p className="text-3xl font-extrabold text-gray-900">{dashboardData.totalFall}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-purple-600 mb-2">Labels</p>
              <p className="text-3xl font-extrabold text-gray-900">{dashboardData.totalLabels}</p>
            </div>
          </div>
        </div>

        {/* Total Contacts */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total Contacts</h2>
          <p className="text-3xl font-bold text-blue-500">{dashboardData.totalContacts}</p>
          <ExportOnlyContacts contacts={dashboardData.contactList} />
        </div>

        {/* Total Unique Contacts */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Total unique contacts</h2>
          <p className="text-3xl font-bold text-blue-500">{dashboardData.totalUniqueContacts}</p>
          <ExportOnlyContacts contacts={dashboardData.uniqueContactList} />
        </div>
      </div>

      {/* Contacts Overview and Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts Overview Component */}
        <ContactsOverview
          // contactsPerYear={dashboardData.contactsPerYear}
          labelsPerYear={dashboardData.labelsPerYear}
        />

        {/* Unique Contact Graph */}
        <UniqueContactGraph contactsPerYear={dashboardData.contactsPerYear} />

        {/* Bar Graph for Contacts per Year */}
        <DashGraph contactsPerYear={dashboardData.contactsPerYear} />
      </div>
    </div>
  );
};

export default Dashboard;
