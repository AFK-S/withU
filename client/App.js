import { StyleSheet, Text, View, StatusBar } from 'react-native';
import Auth from './screens/auth/AuthScreen'
import * as Font from 'expo-font';
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from './screens/auth/GetStarted';
import LoginForm from './screens/auth/Login';
import { useState } from 'react';
import MainScreen from './screens/MainScreen';
import Sos from './screens/pages/Sos';
import Map from './screens/pages/Map';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const Stack = createNativeStackNavigator();

  const Tab = createBottomTabNavigator();

  let [fontsLoaded] = useFonts({
    'Poppins-Bold': require('./assets/Fonts/Poppins-Bold.ttf'),
    'Poppins-Thin': require('.//assets/Fonts/Poppins-Thin.ttf'),
    'Poppins-Medium': require('.//assets/Fonts/Poppins-Medium.ttf')
  })

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <NavigationContainer >
        {isLoggedIn ? <MainScreen /> : <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
      </NavigationContainer >

    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
