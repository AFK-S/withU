import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, TabActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Sos from './pages/Sos';
import LoginForm from './auth/Login';
const BottomNav = () => {
    const Tab = createBottomTabNavigator();
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name='sos' component={Sos} />
                <Tab.Screen name='home' component={LoginForm} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({

})

export default BottomNav;
