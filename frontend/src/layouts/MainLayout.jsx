import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-gray-600 text-white min-h-screen">
      <Outlet />
    </div>
  );
};

export default MainLayout;
