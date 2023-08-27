import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useState, useEffect, createContext, useContext } from 'react'
import * as Location from 'expo-location'
import io from 'socket.io-client'
import { SERVER_URL } from '../config'

const StateContext = createContext()
export default StateContext

export const StateProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [User, setUser] = useState(null)

  useEffect(() => {
    ;(async () => {
      const user = await AsyncStorage.getItem('user')
      if (user === null) return setIsLogin(false)
      const { user_id, emergency_contact, password } = await JSON.parse(user)
      if (!(user_id && emergency_contact && password)) return setIsLogin(false)
      setUser(await JSON.parse(user))
      setIsLogin(true)
    })()
  }, [isLogin])

  return (
    <StateContext.Provider
      value={{
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        User,
        setUser,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const SocketProvider = ({ children }) => {
  const { User, setUser, loading, setLoading, setIsLogin } = useContext(
    StateContext,
  )

  const [socket] = useState(() =>
    io(SERVER_URL, {
      transports: ['websocket'],
    }),
  )
  const [location, setLocation] = useState(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', async () => {
      const user = await JSON.parse(await AsyncStorage.getItem('user'))
      setUser(user)
      socket.emit('Set_User_ID', user.user_id)
      setIsSocketConnected(true)
      console.log('connected')
    })
    socket.on('connect_error', (err) => {
      console.log(err)
    })
    socket.on('disconnect', () => {
      setIsSocketConnected(false)
      console.log('disconnected')
    })
    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('disconnect')
    }
  }, [])

  useEffect(() => {
    if (!isSocketConnected) return
    ;(async () => {
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
  }, [isSocketConnected])

  const Logout = async () => {
    await AsyncStorage.removeItem('user')
    setUser(null)
    setIsLogin(false)
  }

  return (
    <StateContext.Provider
      value={{
        socket,
        location,
        User,
        Logout,
        setLoading,
        loading,
        isSocketConnected,
      }}
    >
      {children}
    </StateContext.Provider>
  )
}
