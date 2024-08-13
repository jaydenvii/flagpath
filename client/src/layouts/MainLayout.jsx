import React from "react";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-semibold">
      <Outlet />
    </div>
  );
};

export default MainLayout;
