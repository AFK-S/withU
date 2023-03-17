import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import Auth from "./pages/auth/Auth";
import MainScreens from "./pages/MainScreen/MainScreens";
import { useLocalStorage } from "@mantine/hooks";
import { MantineProvider, ColorSchemeProvider, Paper } from "@mantine/core";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [colorScheme, setColorScheme] = useLocalStorage(
    "mantine-color-scheme",
    {
      defaultValue: "light",
      getInitialValueInEffect: true,
    }
  );

  const toggleColorScheme = () => {
    console.log(colorScheme);
    setColorScheme(colorScheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="App">
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }}>
          <Paper padding="xl" shadow="md">
            <BrowserRouter>
              {isLoggedIn ? <MainScreens /> : <Auth />}
            </BrowserRouter>
          </Paper>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  );
}

export default App;
