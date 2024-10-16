// src/components/Login.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { loginAdmin, loginGuest, error } = useContext(AuthContext);

  // Local state for form inputs
  const [role, setRole] = useState("admin"); // 'admin' or 'guest'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "admin") {
      loginAdmin(password);
    } else if (role === "guest") {
      loginGuest(username, password);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
      {/* Header Section */}
      <header className="bg-gray-500 w-full p-4 shadow-lg flex-shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
          KnowMySlots
        </h1>
        <p className="text-center text-gray-200 text-base md:text-lg mt-1">
          Contact and Email Management
        </p>
      </header>

      {/* Login Form Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white shadow-2xl rounded-lg p-4 md:p-6 max-w-xs md:max-w-md w-full">
          {/* Icon */}
          <div className="flex justify-center items-center mb-4">
            <FaUserCircle className="text-blue-500 text-4xl md:text-6xl" />
          </div>

          {/* Tabs for Role Selection */}
          <div className="flex justify-center mb-3 md:mb-4">
            <button
              onClick={() => setRole("admin")}
              className={`px-2 md:px-3 py-1 mr-1 md:mr-2 rounded-t-lg focus:outline-none text-xs md:text-sm ${
                role === "admin"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Admin Login
            </button>
            <button
              onClick={() => setRole("guest")}
              className={`px-2 md:px-3 py-1 rounded-t-lg focus:outline-none text-xs md:text-sm ${
                role === "guest"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Guest Login
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-white p-3 md:p-4 rounded-b-lg shadow-md">
            {/* Heading */}
            <h2 className="text-lg md:text-xl font-semibold text-center text-gray-800 mb-2">
              {role === "admin" ? "Admin Login" : "Guest Login"}
            </h2>

            {/* Description */}
            <p className="text-center text-gray-600 mb-3 text-xs md:text-sm">
              {role === "admin"
                ? "Enter your password to continue"
                : "Enter your username and password to continue"}
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-1 rounded mb-2 text-xs md:text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
              {/* Username Field (Only for Guest) */}
              {role === "guest" && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-medium mb-1 text-xs md:text-sm"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={role === "guest"}
                    className="w-full px-2 md:px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-xs md:text-sm"
                  />
                </div>
              )}

              {/* Password Field */}
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium mb-1 text-xs md:text-sm"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-2 md:px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-xs md:text-sm"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 cursor-pointer pt-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`w-full py-1 px-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-200 text-xs md:text-sm ${
                  role === "admin"
                    ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
                    : "bg-green-500 hover:bg-green-600 focus:ring-green-400"
                } text-white`}
              >
                {role === "admin" ? "Login as Admin" : "Login as Guest"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-3 text-center text-gray-500 text-xs">
              &copy; {new Date().getFullYear()} KnowMySlots. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
