import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";

const MainScreens = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default MainScreens;
