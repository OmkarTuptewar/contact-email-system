import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // Import XLSX for exporting to Excel
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const PdfStats = () => {
  const [pdfData, setPdfData] = useState({
    totalUniqueYears: 0,
    totalLabels: 0,
    totalLinks: 0,
    totalUniqueLinks: 0,
    totalLinksList: [],
    totalUniqueLinksList: [],
  });

  useEffect(() => {
    const fetchPdfStats = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/pdf/stats`);
        setPdfData(response.data);
      } catch (error) {
        console.error("Error fetching PDF statistics:", error);
      }
    };

    fetchPdfStats();
  }, []);

  const exportToExcel = (pdfs, fileName) => {
    const worksheetData = [];
    const header = ["PDF URLs"]; // Header for the PDF URLs
    worksheetData.push(header);

    // Add each PDF URL to the worksheet data
    pdfs.forEach(pdf => {
      worksheetData.push([pdf]); // Each URL is added as a new row
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PDFs");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Unique Years */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Total Pdfs Years
        </h2>
        <p className="text-3xl font-bold text-green-500 mt-6 ">
          {pdfData.totalUniqueYears}
        </p>
      </div>

      {/* Total Labels */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-8 text-gray-900 dark:text-white">
          Total Labels
        </h2>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {pdfData.totalLabels}
        </p>
      </div>

      {/* Total PDFs */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Total PDFs
        </h2>
        <p className="text-3xl font-bold text-blue-500">
          {pdfData.totalLinks}
        </p>
        {/* Export PDFs Button */}
        <button
          onClick={() => exportToExcel(pdfData.totalLinksList, "Total_PDFs")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Export PDFs
        </button>
      </div>

      {/* Total Unique PDFs */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col items-center transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Total Unique PDFs
        </h2>
        <p className="text-3xl font-bold text-blue-500">
          {pdfData.totalUniqueLinks}
        </p>
        {/* Export Unique PDFs Button */}
        <button
          onClick={() => exportToExcel(pdfData.totalUniqueLinksList, "Unique_PDFs")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
          Export Unique PDFs
        </button>
      </div>
    </div>
  );
};

export default PdfStats;
