import React from "react";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

const MainLayout = () => {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-semibold">
      <Outlet />
      <Analytics />
    </div>
  );
};

export default MainLayout;
