import MapView, { Callout, Circle, Marker } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import call from "react-native-phone-call";

const Map = ({ socket, User, location }) => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    socket.emit("Get_Active_Users", (users) => {
      setActiveUsers(users);
    });
  }, []);

  socket.on("Send_Active_Users", (users) => {
    setActiveUsers(users);
  });

  const triggerCall = (phone_number) => {
    if (phone_number.length != 10) {
      return console.error("Invalid Number");
    }
    call({
      number: phone_number,
      prompt: true,
    }).catch(console.error);
  };

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
                title={user.user_id}
                opacity={user.user_id === User.user_id ? 1 : 0.5}
              >
                <Callout
                  onPress={() => {
                    if (user.user_id !== User.user_id) {
                      triggerCall(user.phone_number);
                    }
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                      }}
                    >
                      <Text
                        style={{
                          textTransform: "capitalize",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {user.name}
                      </Text>
                      <Text
                        style={{
                          textTransform: "capitalize",
                          fontSize: 12,
                        }}
                      >
                        {user.gender}
                      </Text>
                    </View>
                    {user.user_id !== User.user_id && (
                      <Text
                        style={{
                          fontSize: 20,
                          marginLeft: 10,
                        }}
                      >
                        📞
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
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
