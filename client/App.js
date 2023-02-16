import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import React, { useState, useEffect } from "react";
import AppLoading from "expo-app-loading";
import Auth from "./screens/auth/AuthScreen";
import MainScreen from "./screens/MainScreen";

export default function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [Alert, setAlert] = useState({
    isAlert: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");
      if (user === null) {
        return setIsLogin(false);
      }
      const { user_id, name, phone_number, gender, emergency_contact } =
        JSON.parse(user);
      if (!(user_id && name && phone_number && gender && emergency_contact)) {
        return setIsLogin(false);
      }
      setIsLogin(true);
    })();
  }, [isLogin]);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/Fonts/Poppins-Bold.ttf"),
    "Poppins-Thin": require(".//assets/Fonts/Poppins-Thin.ttf"),
    "Poppins-Medium": require(".//assets/Fonts/Poppins-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <NavigationContainer>
        {isLogin ? (
          <MainScreen />
        ) : (
          <Auth setIsLogin={setIsLogin} setAlert={setAlert} />
        )}
      </NavigationContainer>
    </>
  );
}
