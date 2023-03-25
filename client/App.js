import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import React, { useContext } from "react";
// import AppLoading from "expo-app-loading";
import Auth from "./screens/auth/AuthScreen";
import MainScreen from "./screens/MainScreen";
import StateContext, {
  StateProvider,
  SocketProvider,
} from "./context/StateContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/Fonts/Poppins-Bold.ttf"),
    "Poppins-Thin": require(".//assets/Fonts/Poppins-Thin.ttf"),
    "Poppins-Medium": require(".//assets/Fonts/Poppins-Medium.ttf"),
  });

  if (!fontsLoaded) {
    // return <AppLoading />;
    return null;
  }

  return (
    <StateProvider>
      <StatusBar barStyle={"dark-content"} />
      <NavigationContainer>
        <Provider />
      </NavigationContainer>
    </StateProvider>
  );
}

const Provider = () => {
  const { isLogin } = useContext(StateContext);
  return isLogin ? (
    <SocketProvider>
      <MainScreen />
    </SocketProvider>
  ) : (
    <Auth />
  );
};
