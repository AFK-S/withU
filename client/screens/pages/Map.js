import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";

const Map = ({ socket, location }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  socket.emit("Get_Active_Users", (users) => {
    setActiveUsers(users);
  });

  socket.on("Send_Active_Users", (users) => {
    setActiveUsers(users);
  });

  return (
    <View style={styles.container}>
      {location !== null ? (
        <MapView
          style={{
            width: "100%",
            height: "100%",
          }}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          showsUserLocation={true}
          provider="google"
        >
          {activeUsers.map((user, index) => {
            return (
              <Marker
                key={index}
                coordinate={user.coordinates}
                title={user.user_id}
                description={user.gender}
              />
            );
          })}
          <Circle center={location} radius={100} />
        </MapView>
      ) : (
        <Text>Waiting for location</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Map;
