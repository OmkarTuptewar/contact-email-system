import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DashGraph from "./DashGraph";
import DashSearch from "./DashSearch";
// import ExportContacts from "./ExportContacts";
import ExportOnlyContacts from "./ExportOnlyContacts";
import UniqueContactGraph from "./UniqueContactGraph";
import ContactsOverview from "./ContactsOverview";
import DarkMode from "./DarkMode";

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

  const [emailData, setEmailData] = useState({
    totalYears: 0,
    totalEmails: 0,
    totalStudent: 0,
    totalAgent: 0,
    totalUniqueEmails: 0,
    totalLabels: 0,
    emailList: [],
    uniqueEmailList: [],
  });

  const [contacts, setContacts] = useState([]); // State to hold the individual contacts
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/dashboard/data`
        );
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
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/contacts/allcontacts`
        );
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
    
    const fetchEmails = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/email/allemails`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch Emails");
        }
        const data = await response.json();
        setEmails(data);
      } catch (err) {
        console.error("Error fetching Emails:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    const fetchEmailData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/dashboard/handleEmails`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch email data");
        }
        const data = await response.json();
        setEmailData(data);
      } catch (err) {
        console.error("Error fetching email data:", err);
        setError(err.message);
      }
    };

    fetchDashboardData();
    fetchContacts();
    fetchEmailData();
    fetchEmails();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-blue-500 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Back Arrow */}
      <Link to="/Contact" className="absolute left-4 top-4">
        <FontAwesomeIcon
          icon={faArrowLeft}
          className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-3xl transition-colors duration-300"
        />
      </Link>

      {/* Dark Mode Toggle */}
      <div className="absolute right-4 top-4">
        <DarkMode />
      </div>

      {/* Dashboard Title and Description */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4 text-center tracking-tight transition-colors duration-300">
          Dashboard
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
          Welcome to your personalized dashboard! Manage your contacts, track
          activities, and access important tools all in one place.
        </p>
      </div>

      {/* Search Component */}
      <DashSearch contacts={contacts} emails={emails} />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Years */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Contact Years
          </h2>
          <p className="text-4xl font-bold text-green-500 mt-6">
            {dashboardData.totalYears}
          </p>
          {/* <ExportContacts /> */}
        </div>

        {/* Total Seasons */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Contacts Each
          </h2>
          <div className="flex justify-between space-x-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600 mb-2">
                Spring
              </p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {dashboardData.totalSpring}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 mb-2">Fall</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {dashboardData.totalFall}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-purple-600 mb-2">
                Labels
              </p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {dashboardData.totalLabels}
              </p>
            </div>
          </div>
        </div>

        {/* Total Contacts */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Contacts
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {dashboardData.totalContacts}
          </p>
          <ExportOnlyContacts contacts={dashboardData.contactList} />
        </div>

        {/* Total Unique Contacts */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Unique Contacts
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {dashboardData.totalUniqueContacts}
          </p>
          <ExportOnlyContacts contacts={dashboardData.uniqueContactList} />
        </div>



    {/*//////////////////////////////////// Emails data////////////////////////////////////////////////////// */}  


        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Emails Years
          </h2>
          <p className="text-3xl font-bold text-green-500 mt-6 ">
            {emailData.totalYears}
          </p>
          {/* <ExportContacts /> */}
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Emails Each
          </h2>
          <div className="flex justify-between space-x-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-green-600 mb-2">
               Student
              </p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {emailData.totalStudent}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-red-600 mb-2">Agent</p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {emailData.totalAgent}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-purple-600 mb-2">
                Labels
              </p>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {emailData.totalLabels}
              </p>
            </div>
          </div>
        </div>

        {/* Total Emails */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Emails
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {emailData.totalEmails}
          </p>
          <ExportOnlyContacts contacts={emailData.emailList} />
        </div>

        {/* Total Unique Emails */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Total Unique Emails
          </h2>
          <p className="text-3xl font-bold text-blue-500">
            {emailData.totalUniqueEmails}
          </p>
          <ExportOnlyContacts contacts={emailData.uniqueEmailList} />
        </div>
      </div>

      {/* Contacts Overview and Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contacts Overview Component */}
        <ContactsOverview labelsPerYear={dashboardData.labelsPerYear} />

        {/* Unique Contact Graph */}
        <UniqueContactGraph contactsPerYear={dashboardData.contactsPerYear} />

        {/* Bar Graph for Contacts per Year */}
        <DashGraph contactsPerYear={dashboardData.contactsPerYear} />
      </div>
    </div>
  );
};

export default Dashboard;
