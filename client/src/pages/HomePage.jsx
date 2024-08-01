import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-md p-5">
        <h1 className="mb-8 text-7xl text-center">FLAGPATH</h1>
        <div className="flex justify-center mt-4">
          <Link
            to="/play"
            className="px-5 py-4 bg-gray-700 hover:bg-gray-800 border-white border-2 hover:border-slate-100 text-5xl"
          >
            <p className="px-9">PLAY</p>
          </Link>
        </div>
        <div className="flex justify-center mt-4">
          <Link
            to="/tutorial"
            className="px-5 py-4 bg-gray-700 hover:bg-gray-800 border-white border-2 hover:border-slate-100 text-5xl"
          >
            <p className="px-9">TUTORIAL</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
