import MapView, { Circle, Marker } from 'react-native-maps'
import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

const Map = ({ route, socket, User, location }) => {
  const [activeUsers, setActiveUsers] = useState([])
  const [source, setSource] = useState({})
  const [destination, setDestination] = useState({})

  // if (route.params.user_id) {
  //   socket.emit(
  //     'Get_Direction_Location',
  //     User.user_id,
  //     route.params.user_id,
  //     (location) => {
  //       setSource(location.source)
  //       setDestination(location.destination)
  //     },
  //   )
  // }

  useEffect(() => {
    socket.emit('Get_Active_Users', (users) => {
      setActiveUsers(users)
    })
  }, [])

  socket.on('Send_Active_Users', (users) => {
    setActiveUsers(users)
  })

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {location !== null ? (
        <MapView
          style={{
            width: '100%',
            height: '100%',
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          provider="google"
        >
          {activeUsers.map((user, index) => {
            return (
              <Marker
                key={index}
                coordinate={user.coordinates}
                title={user.name}
                opacity={user.user_id === User.user_id ? 1 : 0.5}
              />
            )
          })}
          <Circle
            center={location}
            radius={500}
            fillColor={'rgba(0,0,0,0.1)'}
          />
        </MapView>
      ) : (
        <Text>Waiting for location</Text>
      )}
    </View>
  )
}

export default Map
