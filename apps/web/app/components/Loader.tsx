import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-4">
      <div className="bg-gray-800 bg-opacity-90 backdrop-blur p-8 rounded-2xl shadow-2xl border border-white border-opacity-10 flex flex-col items-center space-y-4">
        <span className="loading loading-dots loading-lg text-white"></span>
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
