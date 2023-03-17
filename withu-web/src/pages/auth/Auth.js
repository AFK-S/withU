import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Routes, Route } from "react-router-dom";
import Error from "../Error";
import Dashboard from "../MainScreen/Dashboard";
const Auth = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Auth;
