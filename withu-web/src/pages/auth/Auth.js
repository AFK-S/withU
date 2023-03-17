import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Routes, Route } from "react-router-dom";
import Error from "../Error";

const Auth = ({ setIsLogin }) => {
  return (
    <Routes>
      <Route path="/" element={<Login setIsLogin={setIsLogin} />} />
      <Route path="/register" element={<Register setIsLogin={setIsLogin} />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default Auth;
