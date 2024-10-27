// src/components/Login.js
import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login, error } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="flex flex-col bg-gray-100 h-screen">
  <header className="bg-gray-700 w-full p-6 shadow-lg flex-shrink-0">
    <h1 className="text-3xl md:text-4xl font-bold text-center text-white">
      KnowMySlots
    </h1>
    <p className="text-center text-gray-300 text-base md:text-lg mt-1">
      Management Portal
    </p>
  </header>

  <div className="flex-1 flex items-center justify-center px-4">
    <div className="bg-white shadow-2xl rounded-lg p-6 md:p-8 max-w-xs md:max-w-md w-full">
      <div className="flex justify-center items-center mb-6">
        <FaUserCircle className="text-blue-600 text-5xl md:text-7xl" />
      </div>

      <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-800 mb-2">
        Login
      </h2>

      <p className="text-center text-gray-600 mb-4 text-sm md:text-base">
        Enter your username and password to continue
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm md:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition duration-200"
          />
        </div>

        <div className="relative">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2 text-sm md:text-base"
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition duration-200"
          />
          <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer pt-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition duration-200 bg-blue-600 hover:bg-blue-700 focus:ring-blue-400 text-white text-sm md:text-base"
        >
          Login
        </button>
      </form>

      <div className="mt-4 text-center text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} KnowMySlots. All rights reserved.
      </div>
    </div>
  </div>
</div>

  );
};

export default Login;
