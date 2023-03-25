import MapView, { Circle, Marker } from "react-native-maps";
import React, { useState, useEffect, useContext } from "react";
import { View, Text } from "react-native";
import StateContext from "../../context/StateContext";

const Map = () => {
  const { socket, socketLoading, location, User, PoliceInfo, SOSInfo } =
    useContext(StateContext);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    if (!socketLoading) {
      socket.emit("Get_All_Active_Users", (users) => {
        setActiveUsers(users);
      });
    }
  }, [socketLoading]);

  socket.on("Send_Active_Users", (users) => {
    setActiveUsers(users);
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {location !== null ? (
        <MapView
          style={{
            width: "100%",
            height: "100%",
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
            );
          })}
          {PoliceInfo.map((police, index) => {
            return (
              <Marker
                key={index}
                title={police.branch_name}
                coordinate={police.coordinates}
                pinColor={"black"}
              />
            );
          })}
          {SOSInfo.map((sos, index) => {
            return (
              <Circle
                center={sos.coordinates}
                radius={50}
                fillColor={"rgba(255,0,0,0.1)"}
                key={index}
              />
            );
          })}
          <Circle
            center={location}
            radius={500}
            fillColor={"rgba(0,0,0,0.1)"}
          />
        </MapView>
      ) : (
        <Text>Waiting for location</Text>
      )}
    </View>
  );
};

export default Map;
