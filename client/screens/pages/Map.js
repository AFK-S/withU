import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const Map = ({ socket, location }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  socket.emit("Get_Active_Users", (users) => {
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
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMapReady={() =>
            console.log(
              `Coordinate: (${location.latitude}, ${location.longitude})`
            )
          }
        >
          {activeUsers.map((user, index) => {
            return (
              <Marker
                key={index}
                coordinate={user.coordinates}
                title={user._id}
              />
            );
          })}
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
