import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Sos from './pages/Sos'
import Map from './pages/Map';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNav from './BottomNav';


const MainScreen = () => {
    const Stack = createNativeStackNavigator();

    return (
        
        <View>

        <Stack.Navigator initialRouteName='sos'>
            <Stack.Screen name='sos' component={Sos}
                options={{ headerShown: false }} />
            <Stack.Screen name='map' component={Map}
                options={{ headerShown: false }} />
        </Stack.Navigator>
        </View>
        
         

        
    )
}

export default MainScreen

const styles = StyleSheet.create({})