// components/ContactsOverview.js

import React, { useEffect, useState } from "react";
import ExportOnlyContacts from "./ExportOnlyContacts"; // Import your export component

const ContactsOverview = ({labelsPerYear}) => {
  const [contactsPerYear, setContactsPerYear] = useState({});

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/contactlist");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();

        // Extract categorized contacts directly from the fetched data
        setContactsPerYear(data.categorizedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-h-[62vh]">
      {/* Fixed header */}
      <h2 className="text-2xl font-semibold mb-4">Contacts Overview</h2>

      {/* Scrollable content */}
      <div className="max-h-[50vh] overflow-y-auto space-y-4">
        {Object.entries(contactsPerYear).map(([year, seasons]) => (
          <div key={year} className="border-b pb-4">
            <h3 className="text-xl font-bold mb-2">{year}</h3>
            <div className="flex justify-between">
              {/* Spring Section */}
              <div className="w-1/2">
                <p className="font-semibold text-green-500">Spring</p>
                <p className="text-gray-700">Contacts: {seasons.spring.length}</p>
                <p className="text-gray-700">Labels: {labelsPerYear[year]?.spring.count || 0}</p>
                <ExportOnlyContacts contacts={seasons.spring} fileName={`${year}_spring_contacts.xlsx`} />
              </div>
              {/* Fall Section */}
              <div className="w-1/2">
                <p className="font-semibold text-red-500">Fall</p>
                <p className="text-gray-700">Contacts: {seasons.fall.length}</p>
                <p className="text-gray-700">Labels: {labelsPerYear[year]?.fall.count || 0}</p>
                <ExportOnlyContacts contacts={seasons.fall} fileName={`${year}_fall_contacts.xlsx`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsOverview;    
