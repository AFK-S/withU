import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Error from "../Error";

const MainScreens = ({ setIsLogin }) => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard setIsLogin={setIsLogin} />} />
      <Route path="/*" element={<Dashboard setIsLogin={setIsLogin} />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default MainScreens;
