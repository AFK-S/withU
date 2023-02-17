import { View, Image, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import io from 'socket.io-client'
import * as Location from 'expo-location'
import React, { useState, useEffect } from 'react'
import Sos from './pages/Sos'
import Map from './pages/Map'
import Alerts from './pages/Alerts'

const MainScreen = ({ setIsLogin }) => {
  const socket = io('https://FNF001CODE-A-THON.adityarai16.repl.co', {
    transports: ['websocket'],
  })

  const [location, setLocation] = useState(null)
  const [User, setUser] = useState({})

  socket.on('connect', async () => {
    console.log('connected')
  })

  socket.on('connect_error', (err) => {
    console.log(err)
  })

  socket.on('SOS_Send', (details) => {
    console.log(details)
  })

  useEffect(() => {
    ;(async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return console.error('Permission to access location was denied')
      }
      const user = await JSON.parse(await AsyncStorage.getItem('user'))
      setUser(user)
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 20,
        },
        ({ coords }) => {
          setLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
          socket.emit('Set_Active_User', user, {
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
          console.log('location updated')
        },
      )
      return () => subscription.remove()
    })()
  }, [])

  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator
      initialRouteName="SOS"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 30,
          right: 30,
          elevation: 0,
          backgroundColor: '#FFAACF',
          borderRadius: 25,
        },
      }}
    >
      <Tab.Screen
        name="MAP"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: Platform.OS === 'android' ? 0 : 15,
                backgroundColor: focused ? '#fff' : 'transparent',
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require('../assets/icons/map.png')}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                  // tintColor: focused ? "#fff" : "#000",
                }}
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <Map {...props} socket={socket} User={User} location={location} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="SOS"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: Platform.OS === 'android' ? 0 : 15,
                backgroundColor: focused ? '#fff' : 'transparent',
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require('../assets/icons/alert.png')}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
      >
        {(props) => (
          <Sos
            {...props}
            socket={socket}
            User={User}
            location={location}
            setIsLogin={setIsLogin}
          />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="ALERTS"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                top: Platform.OS === 'android' ? 0 : 15,
                backgroundColor: focused ? '#fff' : 'transparent',
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require('../assets/icons/sos.png')}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                  // tintColor: focused ? "#fff" : "#000",
                }}
              />
            </View>
          ),
        }}
      >
        {(props) => <Alerts {...props} socket={socket} User={User} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default MainScreen
