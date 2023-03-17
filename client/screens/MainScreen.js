import { View, Image, Platform } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AsyncStorage from '@react-native-async-storage/async-storage'
import io from 'socket.io-client'
import * as Location from 'expo-location'
import React, { useState, useEffect, useRef } from 'react'
import Sos from './pages/Sos'
import Map from './pages/Map'
import Alerts from './pages/Alerts'
import Help from './pages/Help'
import * as Notifications from 'expo-notifications'

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// })
const MainScreen = ({ setIsLogin }) => {
  const socket = io('https://withU.adityarai16.repl.co', {
    transports: ['websocket'],
  })

  const [location, setLocation] = useState(null)
  const [User, setUser] = useState({})
  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState(false)
  const notificationListener = useRef()
  const responseListener = useRef()
  const [isSOS, setIsSOS] = useState(false)

  socket.on('connect', async () => {
    const { user_id } = await JSON.parse(await AsyncStorage.getItem('user'))
    socket.emit('Set_User_ID', user_id)
    console.log('connected')
    socket.emit('Is_SOS', (boolean) => setIsSOS(boolean))
  })

  socket.on('connect_error', (err) => {
    console.log(err)
  })

  socket.on('Send_Notification', async (details) => {
    console.log('notification received')
    // await schedulePushNotification(details)
  })

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  //   notificationListener.current = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       setNotification(notification)
  //     },
  //   )
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener()
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current)
  //     Notifications.removeNotificationSubscription(responseListener.current)
  //   }
  // }, [])

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
          socket.emit('Set_Active_User', {
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
            isSOS={isSOS}
            setIsSOS={setIsSOS}
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
      <Tab.Screen
        name="HELP"
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
                source={require('../assets/icons/police.png')}
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
        {(props) => <Help />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

// async function schedulePushNotification(details) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'I am in danger',
//       body: `Sent by ${details.name}`,
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   })
// }

// async function registerForPushNotificationsAsync() {
//   const { status } = await Notifications.requestPermissionsAsync()
//   if (status !== 'granted') {
//     console.log('Failed to get push token for push notification!')
//     return
//   }
//   const token = (await Notifications.getExpoPushTokenAsync()).data
//   return token
// }

export default MainScreen
