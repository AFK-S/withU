import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Sos from './pages/Sos';
import Map from './pages/Map';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BottomNav from './BottomNav';

const MainScreen = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator>
            <Tab.Screen name='sos' component={Sos} />
            <Tab.Screen name='map' component={Map} />
            <Tab.Screen name='alert' component={Map} />
        </Tab.Navigator>
    )
}

export default MainScreen

const styles = StyleSheet.create({})