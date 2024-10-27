import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaSave } from 'react-icons/fa';

const EmailForm = ({ year, season, selectedLabel, setEmails, fetchLabels }) => {
    const [label, setLabel] = useState('');
    const [emailList, setEmailList] = useState('');
    const [isEditingLabel, setIsEditingLabel] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedLabel) {
            setLabel(selectedLabel); // Adapted for selectedLabel
        } else {
            setLabel('');
        }
    }, [selectedLabel]);

    const handleLabelEdit = () => {
        setIsEditingLabel(true);
    };

    const handleSaveLabel = async () => {
        if (!label.trim()) {
            toast.error('Label name cannot be empty.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/email/update-label`, {
                year,
                season,
                oldLabel: selectedLabel,
                newLabel: label,
            });

            if (response.status === 200) {
                setIsEditingLabel(false);
                fetchLabels();
                toast.success('Label updated successfully!');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Error updating label. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEmail = async () => {
        const emails = emailList
            .split(/[\s,]+/)
            .map(email => email.trim())
            .filter(email => email !== '');

        if (emails.length === 0) {
            toast.error('Please add at least one email.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/email/add`, {
                year,
                season,
                label,
                emails,
            });

            if (response.status === 200) {
                setEmails(response.data.emails);
                setEmailList('');
                fetchLabels();
                toast.success('Emails added successfully!');
            }
        } catch (error) {
            console.log('Error:', error.response ? error.response.data : error.message);
            toast.error('Error adding emails. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                Add Emails to:
                <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
                    {isEditingLabel ? (
                        <input
                            type="text"
                            className="border p-1 rounded"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                        />
                    ) : (
                        label
                    )}
                </span>
                {isEditingLabel ? (
                    <FaSave className="inline ml-2 cursor-pointer text-green-500" onClick={handleSaveLabel} />
                ) : (
                    <FaEdit className="inline ml-2 cursor-pointer text-gray-500" onClick={handleLabelEdit} />
                )}
            </h3>

            <textarea
                className="border p-2 w-full mb-2 rounded"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="Enter emails separated by commas"
            />

            <button
                className="px-4 py-2 rounded text-white bg-red-500"
                onClick={handleAddEmail}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : 'Add Email'}
            </button>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
        </div>
    );
};

export default EmailForm;
