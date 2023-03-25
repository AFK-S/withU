import MapView, { Circle, Marker } from 'react-native-maps'
import React, { useState, useEffect, useContext } from 'react'
import { View, Text, Image } from 'react-native'
import StateContext from "../../context/StateContext";

const Map = () => {
  const {
    socket,
    socketLoading,
    setLoading,
    location,
    User,
    PoliceInfo,
    SOSInfo,
  } = useContext(StateContext);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!socketLoading) {
      setLoading(true);
      socket.emit("Get_All_Active_Users", (users) => {
        setActiveUsers(users);
        setLoading(false);
      });
    }
  }, [socketLoading])

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
                opacity={user.user_id === User.user_id ? 1 : 0.6}
              />

              // <Marker
              //   key={index}
              //   coordinate={user.coordinates}
              //   opacity={user.user_id === User.user_id ? 1 : 0.6}
              // >
              //   <Image
              //     source={require('../../assets/placeholder.png')}
              //     style={{ width: 40, height: 40 }}
              //     resizeMode="contain"
              //   />
              // </Marker>
            )
          })}
          {PoliceInfo.map((police, index) => {
            return (
              <Marker
                key={index}
                title={police.branch_name}
                coordinate={police.coordinates}
              >
                <Image
                  source={require('../../assets/police.png')}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </Marker>
            )
          })}
          {SOSInfo.map((sos, index) => {
            return (
              <Circle
                center={sos.coordinates}
                radius={30}
                fillColor={'rgba(255,0,0,0.05)'}
                strokeColor={'rgba(255,0,0,0.0)'}
                strokeWidth={0}
                key={index}
              />
            )
          })}
          <Circle
            center={location}
            radius={3000}
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
