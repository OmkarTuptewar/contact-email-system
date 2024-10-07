import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer 
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications 

const EmailForm = ({ year, season, selectedLabel, setEmails, fetchLabels }) => {
    const [label, setLabel] = useState(''); // State for label input
    const [emailList, setEmailList] = useState(''); // State for email input
    const [isEditing, setIsEditing] = useState(false); // Track editing state
  
    useEffect(() => {
        console.log("Selected Label:", selectedLabel);
        if (selectedLabel) {
            setLabel(selectedLabel.name || selectedLabel.label || ''); // Set the label name
            setIsEditing(true); // Set editing mode to true when a label is selected
        } else {
            setLabel(''); // Clear label if no label is selected
            setIsEditing(false); // Reset editing mode when no label is selected
        }
    }, [selectedLabel]);
  
    const handleSubmit = async () => {

        const emails = emailList.split(/[\s,]+/).map(email => email.trim()).filter(email => email);

        // Optional: Email validation regex (basic validation)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const validEmails = emails.filter(email => emailRegex.test(email));
    
        // If you want to alert the user about invalid emails
        const invalidEmails = emails.filter(email => !emailRegex.test(email));
        if (invalidEmails.length > 0) {
            console.warn('Invalid emails:', invalidEmails);
            toast.error(`Some emails are invalid. Please check your input.${invalidEmails}`); // Show error toast for invalid emails
            return; // Exit early if there are invalid emails
        }

        const numericYear = parseInt(year);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/email/add`, {
                year: numericYear,
                season,
                label,
                emails: validEmails,
            });
    
            console.log("Response from server:", response.data); // Log response data
    
            if (response.status === 200) { // Check if the response status is 200
                setEmails(response.data.emails);
                setEmailList('');
                fetchLabels();
                toast.success('Emails added successfully!'); // Show success toast 
            } else {
                toast.error('Unexpected response from server.'); // Handle unexpected status 
            }
        } catch (error) {
            console.log('Error:', error.response ? error.response.data : error.message); // Log error details
            toast.error('Error adding emails. Please try again.'); // Show error toast 
        }
    };
    
    const handleUpdateEmail = async () => {
        // Trim each email and filter out empty strings
        const updatedEmails = emailList.split(/[\s,]+/) // Split by spaces or commas
        .map(email => email.trim()) // Trim whitespace from each email
        .filter(email => email !== ''); // Remove any empty emails
    
        const numericYear = parseInt(year); // Ensure year is a number
        const shouldUpdateEmails = updatedEmails.length > 0; // Check if there are valid emails
    
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/email/update`, {
                year: numericYear,
                season,
                oldLabel: selectedLabel,  // Existing label
                newLabel: label || undefined, // Send newLabel only if it's not empty
                emails: shouldUpdateEmails ? updatedEmails : undefined,  // Send emails only if they exist
            });
    
            console.log('Updated Emails:', response.data.updatedEmail);
    
            // Update the emails state only if emails were updated
            if (shouldUpdateEmails) {
                setEmails(response.data.updatedEmail.emails); // Update the state with new emails
            } else {
                // If only the label was updated, keep the previous emails
                setEmails(prevEmails => prevEmails); // Maintain previous emails
            }
    
            setEmailList(''); // Clear the email list after update
            fetchLabels();
            toast.success('Emails updated successfully!'); // Show success toast
        } catch (error) {
            console.log('Error updating emails:', error);
            toast.error('Error updating emails. Please try again.'); // Show error toast
        }
    };

    return (
        <div>
            <h3 className="font-bold text-lg mb-4 text-gray-800">
                Add Emails:   
                <span className="text-blue-900 font-bold text-1xl p-2 hover:text-blue-600 transition-colors duration-300">
                    {selectedLabel}
                </span>
            </h3>
    
            {/* Label input field */}
            <input
                type="text"
                className="border p-2 w-full mb-2 rounded"
                value={label}
                onChange={(e) => setLabel(e.target.value)} // Allow manual editing
                placeholder="Enter label name"
            />

            {/* Email input field */}
            <textarea
                className="border p-2 w-full mb-2 rounded"
                value={emailList}
                onChange={(e) => setEmailList(e.target.value)}
                placeholder="Enter emails separated by commas"
            />

            {/* Add/Update button */}
            <button
                className={`px-4 py-2 rounded text-white ${isEditing ? 'bg-red-500' : 'bg-blue-500'}`}
                onClick={isEditing ? handleUpdateEmail : handleSubmit} // Call appropriate function
            >
                {isEditing ? 'Append Email' : 'Add Email'}
            </button>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable /> 
        </div>
    );
};

export default EmailForm;
