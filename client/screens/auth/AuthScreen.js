import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import GetStarted from './GetStarted'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginForm from './Login'
import Register from './Register'
import Register2 from './Register2'
const AuthScreen = ({ setIsLoggedIn }) => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="home"
        component={GetStarted}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }}>
        {(props) => <LoginForm {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="register2" options={{ headerShown: false }}>
        {(props) => <Register2 {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      {/* <Stack.Screen
        name="register2"
        component={Register2}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  )
}

export default AuthScreen

const styles = StyleSheet.create({})
