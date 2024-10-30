import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext

const PdfForm = ({ year, selectedLabel, setPdfs, fetchLabels, updateSelectedLabel }) => {
    const { auth } = useContext(AuthContext); // Get auth context
    const [file, setFile] = useState(null); // Single file state
    const [description, setDescription] = useState(''); // Single description state
    const [loading, setLoading] = useState(false);
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [label, setLabel] = useState(selectedLabel); // Store the label directly
    const fileInputRef = useRef(null); // Create a ref for the file input

    useEffect(() => {
        setLabel(selectedLabel); // Update the label when selectedLabel changes
    }, [selectedLabel]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Save the single file
    };
    
    const handleUpdatePdf = async () => {
        const numericYear = parseInt(year);

        // Check if file and description are provided
        if (!file || !description) {
            toast.error('Please enter both file and description.');
            return;
        }

        setLoading(true);

        // Create FormData object to send file and description
        const formData = new FormData();
        formData.append('year', numericYear);
        formData.append('label', label);
        formData.append('pdf', file); // Append the single file
        formData.append('description', description); // Append the description

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/pdf/append-pdfs`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`, // Add the authorization header directly
                },
            });

            if (response.status === 200) {
                setPdfs(response.data.pdfs); // Update state with the appended PDFs
                setFile(null); // Reset the file input state
                setDescription(''); // Reset the description input
                fetchLabels(); // Refresh the labels list
                toast.success('PDF uploaded successfully!');

                // Reset the file input field
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input
                }
            } else {
                toast.error('Failed to upload PDF. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading PDF:', error);
            toast.error('Error uploading PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLabelEdit = () => {
        setIsEditingLabel(!isEditingLabel); // Toggle edit mode
    };

    const handleSaveLabel = async () => {
        if (!label.trim()) {
            toast.error('Label name cannot be empty.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/pdf/update-label`, {
                year,
                oldLabel: selectedLabel, // The current label before update
                newLabel: label, // The updated label
            }, {
                headers: {
                    Authorization: `Bearer ${auth.token}`, // Add the authorization header directly
                },
            });

            if (response.status === 200) {
                fetchLabels(); // Refresh labels list after update
                updateSelectedLabel(label); // Update selectedLabel in the parent
                toast.success('Label updated successfully!');
                setIsEditingLabel(false); // Exit edit mode
            } else {
                toast.error('Failed to update label. Please try again.');
            }
        } catch (error) {
            console.error('Error updating label:', error);
            toast.error('Error updating label. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                Append PDF to:
                <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
                    {isEditingLabel ? (
                        <input
                            type="text"
                            className="border p-1 rounded"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            disabled={loading} // Disable input during loading
                        />
                    ) : (
                        label // Display the label directly
                    )}
                </span>
                {isEditingLabel ? (
                    <FaSave
                        className="inline ml-2 cursor-pointer text-green-500"
                        onClick={handleSaveLabel}
                    />
                ) : (
                    <FaEdit
                        className="inline ml-2 cursor-pointer text-gray-500"
                        onClick={handleLabelEdit}
                    />
                )}
            </h3>

            <div className="flex flex-col mb-2 space-y-2">
                <input
                    type="file"
                    className="border p-2 rounded"
                    onChange={handleFileChange}
                    accept="application/pdf"
                    ref={fileInputRef}
                />
                <textarea
                    className="border p-2 rounded"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter PDF Description"
                    rows={4} // Adjust the number of rows for more space
                />
            </div>

            <button
                className="px-4 py-2 rounded text-white bg-red-500"
                onClick={handleUpdatePdf}
                disabled={loading} // Disable the button during loading
            >
                {loading ? 'Uploading...' : 'Upload PDF'}
            </button>

            
        </div>
    );
};

export default PdfForm;
