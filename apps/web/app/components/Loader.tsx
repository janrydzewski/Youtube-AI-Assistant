import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-300 via-gray-400 to-gray-700 p-4">
      <span className="loading loading-dots loading-xl"></span>
    </div>
  );
};

export default Loader;
