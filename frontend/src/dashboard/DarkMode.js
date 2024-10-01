import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { DarkModeContext } from './DarkModeContext';

const DarkMode = () => {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? (
        <FontAwesomeIcon icon={faSun} className="text-yellow-400 h-6 w-6" />
      ) : (
        <FontAwesomeIcon icon={faMoon} className="text-gray-800 h-6 w-6" />
      )}
    </button>
  );
};

export default DarkMode;
