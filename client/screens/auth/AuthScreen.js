import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import GetStarted from './GetStarted'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from './Login';
import Sos from '../pages/Sos'
import Register from './Register';
import Register2 from './Register2';
const AuthScreen = () => {
    const Stack = createNativeStackNavigator();

    return (

        <Stack.Navigator initialRouteName='Home'
        >
            <Stack.Screen name='home' component={GetStarted}
                options={{ headerShown: false }} />
            <Stack.Screen name='login' component={LoginForm}
                options={{ headerShown: false }} />
            <Stack.Screen name='register' component={Register}
                options={{ headerShown: false }} />
            <Stack.Screen name='register2' component={Register2}
                options={{ headerShown: false }} />
        </Stack.Navigator>

    )
}

export default AuthScreen

const styles = StyleSheet.create({})