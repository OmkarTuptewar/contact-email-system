import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-center items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >
          Menu
          <svg
            className="-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ease-in-out transform" 
            style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10">
          <div className="rounded-md bg-white ring-1 ring-black ring-opacity-5">

          <Link to="/Contact">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out cursor-pointer rounded-t-md">
               Contact Management
              </div>
            </Link>
            <Link to="/Link">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out cursor-pointer rounded-t-md">
                Link Management
              </div>
            </Link>
            <Link to="/Email">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out cursor-pointer">
               Emails Management
              </div>
            </Link>
            <Link to="/Pdf">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out cursor-pointer">
              Pdfs Management
              </div>
            </Link>
            <Link to="/dashboard">
              <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-500 hover:text-white transition duration-200 ease-in-out cursor-pointer rounded-b-md">
                Go To Dashboard
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
