// src/components/Login.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa"; // Icon for aesthetics
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Icons for password visibility

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {/* Header Section */}
      <header className="bg-gray-500 w-full md:w-1/2 p-6 shadow-lg mb-8 rounded-lg">
        <h1 className="text-4xl font-bold text-center text-white">
          KnowMySlots
        </h1>
        <p className="text-center text-gray-200 text-2xl mt-2">
         Contact and Email Management 
        </p>
      </header>

      {/* Login Form Section */}
      <div className="bg-white shadow-2xl rounded-lg p-8 md:p-10 max-w-md w-full">
        {/* Icon */}
        <div className="flex justify-center items-center mb-4 space-x-4">
          <FaUserCircle className="text-blue-500 text-8xl" />
        </div>

        {/* Tabs for Role Selection */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setRole("admin")}
            className={`px-4 py-2 mr-2 rounded-t-lg focus:outline-none ${
              role === "admin"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => setRole("guest")}
            className={`px-4 py-2 rounded-t-lg focus:outline-none ${
              role === "guest"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Guest Login
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          {/* Heading */}
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            {role === "admin" ? "Admin Login" : "Guest Login"}
          </h2>

          {/* Description */}
          <p className="text-center text-gray-600 mb-6">
            {role === "admin"
              ? "Enter your password to continue"
              : "Enter your username and password to continue"}
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field (Only for Guest) */}
            {role === "guest" && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-gray-700 font-medium mb-1"
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
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}

            {/* Password Field */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-1"
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
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer pt-7"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-200 ${
                role === "admin"
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-400"
                  : "bg-green-500 hover:bg-green-600 focus:ring-green-400"
              } text-white`}
            >
              {role === "admin" ? "Login as Admin" : "Login as Guest"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} KnowMySlots. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
