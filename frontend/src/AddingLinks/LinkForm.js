import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { FaEdit, FaSave } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const LinkForm = ({ year, selectedLabel, setLinks, fetchLabels, updateSelectedLabel }) => {
    const [linkList, setLinkList] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [label, setLabel] = useState(selectedLabel); // Store the label directly

    useEffect(() => {
        setLabel(selectedLabel); // Update the label when selectedLabel changes
    }, [selectedLabel]);

    const handleUpdateLink = async () => {
        const updatedLinks = linkList.split(/[\s,]+/).map(link => link.trim()).filter(link => link);
        const numericYear = parseInt(year);

        if (!updatedLinks.length) {
            toast.error('Please enter at least one link.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/link/append-links`, {
                year: numericYear,
                label: label, // Use updated label instead of selectedLabel
                newLinks: updatedLinks,
            });

            setLinks(response.data.Links); // Update state with the appended links
            setLinkList(''); // Clear the input
            fetchLabels(); // Refresh the labels list
            toast.success('Links updated successfully!');
        } catch (error) {
            console.error('Error updating links:', error);
            toast.error('Error updating links. Please try again.');
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
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/link/update-label`, {
                year,
                oldLabel: selectedLabel, // The current label before update
                newLabel: label, // The updated label
            });

            if (response.status === 200) {
                fetchLabels(); // Refresh labels list after update
                updateSelectedLabel(label); // Update selectedLabel in the parent
                toast.success('Label updated successfully!');
            } else {
                toast.error('Failed to update label. Please try again.');
            }
        } catch (error) {
            console.error('Error updating label:', error);
            toast.error('Error updating label. Please try again.');
        } finally {
            setIsEditingLabel(false); // Exit edit mode
            setLoading(false);
        }
    };

    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                Append Links to:
                <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
                    {isEditingLabel ? (
                        <input
                            type="text"
                            className="border p-1 rounded"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
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

            <textarea
                className="border p-2 w-full mb-2 rounded"
                value={linkList}
                onChange={(e) => setLinkList(e.target.value)}
                placeholder="Enter links separated by commas"
            />

            <button
                className="px-4 py-2 rounded text-white bg-red-500"
                onClick={handleUpdateLink}
                disabled={loading} // Disable the button during loading
            >
                Append Link
            </button>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </div>
    );
};

export default LinkForm;
