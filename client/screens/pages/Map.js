import MapView, { Circle, Marker } from "react-native-maps";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image } from "react-native";
import StateContext from "../../context/StateContext";
import axios from "axios";
import { SERVER_URL } from "../../config";

const Map = () => {
  const { socket, setLoading, location, User } = useContext(StateContext);
  const [activeUsers, setActiveUsers] = useState([]);
  const [PoliceInfo, setPoliceInfo] = useState([]);
  const [SOSInfo, setSOSInfo] = useState([]);

  const Fetch_Active_Users = async () => {
    const { data } = await axios.get(`${SERVER_URL}/api/active/location`);
    setActiveUsers(data);
  };

  useEffect(() => {
    setLoading(true);
    Fetch_Active_Users();
    setLoading(false);
  }, [socket.connected]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/api/police_sos`);
        setPoliceInfo(data.police_response);
        setSOSInfo(data.sos_response);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    })();
  }, [socket.connected]);

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
            );
          })}
          {PoliceInfo.map((police, index) => {
            return (
              <Marker
                key={index}
                title={police.branch_name}
                coordinate={police.coordinates}
              >
                <Image
                  source={require("../../assets/police.png")}
                  style={{ width: 40, height: 40 }}
                  resizeMode="contain"
                />
              </Marker>
            );
          })}
          {SOSInfo.map((sos, index) => {
            return (
              <Circle
                center={sos.coordinates}
                radius={30}
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
      ) : (
        <Text>Waiting for location</Text>
      )}
    </View>
  );
};

export default Map;
