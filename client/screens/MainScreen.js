import { StyleSheet, View, Image, Text, Platform } from 'react-native'
import React from 'react'
import Sos from './pages/Sos';
import Map from './pages/Map';
import Alerts from './pages/Alerts';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const MainScreen = () => {
    const Tab = createBottomTabNavigator();
    return (
        <Tab.Navigator
            initialRouteName='SOS'
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 50,
                    left: 20,
                    right: 20,
                    elevation: 0,
                    backgroundColor: '#FA198B',
                    borderWidth: 3,
                    borderColor: "#FA198B",
                    borderRadius: 25,
                    height: 75,
                }
            }}>
            <Tab.Screen name='MAP' component={Map}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'android' ? 0 : 10 }}>
                            <Image
                                source={require('../assets/icons/map.png')}
                                resizeMode='contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? '#fff' : '#000'
                                }} />
                        </View>
                    )
                }} />
            <Tab.Screen name='SOS' component={Sos}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'android' ? 0 : 10 }}>
                            <Image
                                source={require('../assets/icons/alert.png')}
                                resizeMode='contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? '#fff' : '#000',
                                }} />
                        </View>
                    )
                }}
            />
            <Tab.Screen name='ALERTS' component={Alerts}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: Platform.OS === 'android' ? 0 : 10 }}>
                            <Image
                                source={require('../assets/icons/sos.png')}
                                resizeMode='contain'
                                style={{
                                    width: 35,
                                    height: 35,
                                    tintColor: focused ? '#fff' : '#000'
                                }} />
                        </View>
                    )
                }} />
        </Tab.Navigator>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#FFAACF',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 5
    },
})