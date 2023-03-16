import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Auth from "./pages/auth/Auth";
import MainScreens from "./pages/MainScreen/MainScreens";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <BrowserRouter>{isLoggedIn ? <MainScreens /> : <Auth />}</BrowserRouter>
    </div>
  );
}

export default App;
