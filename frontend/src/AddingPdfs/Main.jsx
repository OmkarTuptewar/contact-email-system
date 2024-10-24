import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AddPdfButton from "./AddPdfButton";
import PdfForm from "./PdfForm";
import PdfList from "./PdfList";
import PdfLabels from "./PdfLabels";
import PdfLabelList from "./PdfLabelList";
import PdfTable from "./PdfTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Dropdown from "../components/Dropdown";

const MainPdf = () => {
  const { auth, logout } = useContext(AuthContext);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [pdfs, setPdfs] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loadingPdfs, setLoadingPdfs] = useState(false);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPdfs = async () => {
      if (selectedYear && selectedLabel) {
        setLoadingPdfs(true);
        setError("");
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/pdf/${selectedYear}/${selectedLabel}/pdfs`
          );
          setPdfs(response.data);
        } catch (error) {
          console.error("Error fetching PDFs:", error);
          setError("Failed to fetch PDFs. Please try again.");
        } finally {
          setLoadingPdfs(false);
        }
      } else {
        setPdfs([]);
      }
    };

    fetchPdfs();
  }, [selectedYear, selectedLabel]);

  const fetchLabels = async () => {
    if (!selectedYear) {
      setLabels([]);
      return;
    }

    setLoadingLabels(true); // Start loading state for labels
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/pdf/${selectedYear}/labels`
      );
      setLabels(response.data);
    } catch (error) {
      console.error("Error fetching labels:", error);
      setError("Failed to fetch labels. Please try again.");
    } finally {
      setLoadingLabels(false); // End loading state for labels
    }
  };

  useEffect(() => {
    // Reset the selected label and PDFs when the year changes
    setSelectedLabel(null);
    setPdfs([]);
    fetchLabels(); // Fetch labels whenever the year changes
  }, [selectedYear]);

  const updateSelectedLabel = (newLabel) => {
    setSelectedLabel(newLabel); // Update the selected label
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-gradient-to-r from-yellow-400 h-24 shadow-lg p-4 md:p-6 rounded-lg">
        <Link
          to="/Contact"
          className="text-gray-900 hover:text-gray-600 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          PDF MANAGEMENT - KNOWMYSLOTS
        </h1>

        <div className="flex flex-col md:flex-row items-center space-x-4">
          {/* Dropdown Menu */}
          <Dropdown />
          {/* Welcome Message */}
          <p className="text-gray-700 text-lg font-semibold mb-1">
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

      <div className="grid grid-cols-1 md:grid-cols-8 gap-2 p-2 h-screen bg-black">
        <div className="col-span-1 md:col-span-2 bg-white border rounded-lg shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Years</h2>
          <AddPdfButton onSelectYear={setSelectedYear} />
          <PdfList selectedYear={selectedYear} />
          <PdfLabels onSelectYear={setSelectedYear} fetchLabels={fetchLabels} />
        </div>

        <div className="col-span-1 md:col-span-2 bg-gray-100 border rounded-lg shadow-md p-6 overflow-y-auto overflow-x-hidden">
          <PdfLabelList
            year={selectedYear}
            onSelectLabel={setSelectedLabel}
            labels={labels}
            fetchLabels={fetchLabels}
          />
        </div>

        <div className="col-span-1 md:col-span-4 bg-white border rounded-lg shadow-md p-6 flex flex-col">
          <h2 className="font-bold text-lg mb-4">PDFs</h2>
          <PdfForm
            year={selectedYear}
            selectedLabel={selectedLabel}
            setPdfs={setPdfs}
            fetchLabels={fetchLabels}
            updateSelectedLabel={updateSelectedLabel}
          />

          {auth.role === "admin" && (
            <div className="mt-4">
              {loadingPdfs ? (
                <p>Loading PDFs...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <PdfTable pdfs={pdfs} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPdf;
