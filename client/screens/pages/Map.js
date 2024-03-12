import MapView, { Marker, Circle } from "react-native-maps";
import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import StateContext from "../../context/StateContext";
import axios from "axios";
import { SERVER_URL } from "../../config";

const Map = () => {
  const { socket, setLoading, location, User } = useContext(StateContext);
  const [activeUsers, setActiveUsers] = useState([]);
  const [AdministratorInfo, setAdministratorInfo] = useState([]);
  const [SOSInfo, setSOSInfo] = useState([]);

  const Fetch_Active_Users = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/active/location/meter/${User.user_id}`
      );
      setActiveUsers(data);
    } catch (err) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Fetch_Active_Users();
    setLoading(false);
  }, [socket.connected]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/administrator_sos`);
        setAdministratorInfo(data.administrator_response);
        setSOSInfo(data.sos_response);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    })();
  }, [socket.connected]);

  const mapViewRef = useRef(null);

  const relocateToUserLocation = () => {
    mapViewRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  useEffect(() => {
    socket.on("Update_Active_Users", () => {
      Fetch_Active_Users();
    });
    return () => {
      socket.off("Update_Active_Users");
    };
  }, [socket.connected]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {location !== null ? (
        <>
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 130,
              right: 30,
              backgroundColor: "white",
              width: 60,
              height: 60,
              borderRadius: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={relocateToUserLocation}
          >
            <Image
              source={require("../../assets/icons/precision.png")}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <MapView
            ref={mapViewRef}
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
              if (user?.coordinates) {
                return (
                  <Marker
                    key={index}
                    coordinate={user.coordinates}
                    opacity={user.user_id === User.user_id ? 1 : 0.6}
                    pinColor="red"
                  >
                    <View
                      style={{
                        borderWidth: 2,
                        borderColor: "black",
                        borderRadius: 40,
                      }}
                    >
                      <Image
                        source={require("../../assets/icons/woman.png")}
                        style={{ width: 40, height: 40 }}
                        resizeMode="contain"
                      />
                    </View>
                  </Marker>
                );
              }
            })}
            {AdministratorInfo.map((administrator, index) => {
              return (
                <Marker
                  key={index}
                  title={administrator.branch_name}
                  coordinate={administrator.coordinates}
                >
                  <View
                    style={{
                      borderWidth: 2,
                      borderColor: "black",
                      borderRadius: 40,
                    }}
                  >
                    <Image
                      source={
                        administrator.type_of_user === "police"
                          ? require("../../assets/policeman.png")
                          : require("../../assets/icons/hospital.png")
                      }
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </View>
                </Marker>
              );
            })}
            {SOSInfo.map((sos, index) => {
              return (
                <Circle
                  center={sos.coordinates}
                  radius={120}
                  fillColor={"rgba(255,0,0,0.05)"}
                  strokeColor={"rgba(255,0,0,0.0)"}
                  strokeWidth={0}
                  key={index}
                />
              );
            })}
            <Circle
              center={location}
              radius={3000}
              fillColor={"rgba(0,0,0,0.1)"}
            />
          </MapView>
        </>
      ) : (
        <Text>Waiting for location</Text>
      )}
    </View>
  );
};

export default Map;
