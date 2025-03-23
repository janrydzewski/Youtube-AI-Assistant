import React from "react";

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-4">
      <span className="loading loading-dots loading-xl"></span>
    </div>
  );
};

export default Loader;
