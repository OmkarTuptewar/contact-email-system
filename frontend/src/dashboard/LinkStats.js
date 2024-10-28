import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import XLSX for exporting to Excel
import { faArrowLeft, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const LinksStats = () => {
    const [linkData, setLinkData] = useState({
        totalUniqueYears: 0,
        totalLabels: 0,
        totalLinks: 0,
        totalUniqueLinks: 0,
        totalLinksList: [],
        totalUniqueLinksList: [],
    });

    const { auth } = useContext(AuthContext); // Get auth context

    // Fetch link statistics
    useEffect(() => {
        const fetchLinkStats = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/link/stats`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`, // Add authorization header
                    },
                });
                setLinkData(response.data);
            } catch (error) {
                console.error('Error fetching link statistics:', error);
            }
        };

        fetchLinkStats();
    }, [auth.token]); // Add auth.token to the dependency array

    // Function to export links to Excel
    const exportToExcel = (links, fileName) => {
        const worksheetData = [];
        // Add header for the links
        const header = ['Links'];
        worksheetData.push(header);

        // Add each link to the worksheet data
        links.forEach(link => {
            worksheetData.push([link]); // Each link is added as a new row
        });

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Links');
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {/* Total Unique Years */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Total Links Years
                </h2>
                <p className="text-3xl font-bold text-green-500 mt-6">
                    {linkData.totalUniqueYears}
                </p>
            </div>

            {/* Total Labels */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
                    Total Labels
                </h2>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {linkData.totalLabels}
                </p>
            </div>

            {/* Total Links */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    Total Links
                </h2>
                <p className="text-3xl font-bold text-blue-500">
                    {linkData.totalLinks}
                </p>
                {/* Export Links Button */}
                <button
                    onClick={() => exportToExcel(linkData.totalLinksList, 'Total_Links')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 transition-colors duration-300 transform hover:scale-105"
                >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Export Links
                </button>
            </div>

            {/* Total Unique Links */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300 hover:shadow-xl">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Total Unique Links
                </h2>
                <p className="text-3xl font-bold text-blue-500">
                    {linkData.totalUniqueLinks}
                </p>
                {/* Export Unique Links Button */}
                <button
                    onClick={() => exportToExcel(linkData.totalUniqueLinksList, 'Unique_Links')}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 transition-colors duration-300 transform hover:scale-105"
                >
                    <FontAwesomeIcon icon={faDownload} className="mr-2" />
                    Export Unique Links
                </button>
            </div>
        </div>
    );
};

export default LinksStats;
