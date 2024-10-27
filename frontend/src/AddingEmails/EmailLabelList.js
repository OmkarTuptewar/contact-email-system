import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, onSubmit, year, season }) => {
  const [newLabel, setNewLabel] = useState("");

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newLabel) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/email/add-label`, {
          year,
          season,
          label: newLabel,
          emails: [], 
        });
  
        if (response.status === 201) {
          onSubmit(newLabel); 
          setNewLabel(""); 
          onClose();
          
          // Show success toast
          toast.success("Label added successfully!");
        } else {
          console.error("Unexpected response:", response);
          // Show generic error toast
          toast.error("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error adding label:", error);
        // Show error toast with error message
        toast.error("Error adding label: " + (error.response?.data?.message || "Please try again later."));
      }
    }
  };
  

  if (!isOpen) return null; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded shadow-lg z-10">
        <h2 className="font-bold text-lg mb-4">Add New Label</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Enter label name"
            required
          />
          <div className="flex justify-end mt-4">
            <button type="button" onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Add Label
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EmailLabelList = ({ year, season, onSelectLabel, fetchLabels }) => {
  const [labels, setLabels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (year && season) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/email/${year}/${season}`)
        .then((response) => setLabels(response.data))
        .catch((err) => console.log(err));
    }
  }, [year, season, fetchLabels]);

  const handleLabelClick = (label) => {
    console.log('Label clicked:', label.label);
    onSelectLabel(label.label); 
  };

  const handleAddLabel = (newLabel) => {

    setLabels((prevLabels) => [
      ...prevLabels,
      { name: newLabel, label: newLabel, emails: [] },
    ]);
  };

  return (
    <>
      <h3 className="font-bold text-xl mb-2 text-gray-700">
        Labels
        <button
          onClick={() => setIsModalOpen(true)}
          className="ml-44 bg-blue-500 text-white p-1 px-4 rounded-full"
          title="Add new label"
        >
          +
        </button>
      </h3>
      <div className="rounded-lg p-2 shadow-md w-full ">
        <h4 className="font-semibold text-xl text-gray-600 mb-4">{season}</h4>
        <ul className="space-y-2">
          {labels.map((label, idx) => (
            <li
              key={idx}
              className="cursor-pointer mb-2 p-3 border border-gray-300 rounded-lg transition duration-300 ease-in-out 
                transform hover:bg-blue-200 hover:shadow-xl hover:scale-105 active:scale-95 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 
                text-sm md:text-base lg:text-lg"
              onClick={() => handleLabelClick(label)}
            >
              <span className="text-blue-600 font-medium truncate block">
                {label.name || label.label || "Unnamed Label"}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddLabel} year={year} season={season} />
    </>
  );
};

export default EmailLabelList;
