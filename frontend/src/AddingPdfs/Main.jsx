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
import { ToastContainer } from "react-toastify";


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
            `${process.env.REACT_APP_API_URL}/api/pdf/${selectedYear}/${selectedLabel}/pdfs`,
            {
              headers: {
                Authorization: `Bearer ${auth.token}`, // Add the authorization header directly
              },
            }
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
  }, [selectedYear, selectedLabel, auth.token]); // Added auth.token as a dependency

  const fetchLabels = async () => {
    if (!selectedYear) {
      setLabels([]);
      return;
    }

    setLoadingLabels(true); // Start loading state for labels
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/pdf/${selectedYear}/labels`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Add the authorization header directly
          },
        }
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
      <ToastContainer/>
      {/* Header Section */}
      <div className="flex items-center justify-between bg-gray-800 h-24 shadow-lg p-4 md:p-6 rounded-lg">
        <Link to="/Contact" className="text-white hover:text-gray-300 transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
        </Link>

        <h1 className="text-xl md:text-2xl font-bold text-white">
          PDF MANAGEMENT - KNOWMYSLOTS
        </h1>

        <div className="flex flex-col md:flex-row items-center space-x-4">
          {/* Dropdown Menu */}
          <Dropdown />

          {/* Welcome Message */}
          <p className="text-gray-300 text-lg font-semibold mb-1">
            Welcome, {auth.username}!
          </p>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-200"
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
          <AddPdfButton onSelectYear={setSelectedYear} />
          <PdfList selectedYear={selectedYear} />
          <PdfLabels onSelectYear={setSelectedYear} fetchLabels={fetchLabels} />
        </div>

        {/* Labels Section */}
        <div className="col-span-1 md:col-span-2 bg-gray-200 border rounded-lg shadow-md p-6 overflow-y-auto">
          <PdfLabelList
            year={selectedYear}
            onSelectLabel={setSelectedLabel}
            labels={labels}
            fetchLabels={fetchLabels}
          />
        </div>

        {/* PDFs Section */}
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
                <p className="text-gray-600">Loading PDFs...</p>
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
