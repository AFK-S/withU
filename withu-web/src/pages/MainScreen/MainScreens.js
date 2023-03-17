import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Error from "../Error";

const MainScreens = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/*" element={<Dashboard />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default MainScreens;
