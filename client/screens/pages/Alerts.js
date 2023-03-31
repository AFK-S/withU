import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Modal,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import Styles from "../../CommonStyles";
import StateContext from "../../context/StateContext";
import axios from "axios";
import { SERVER_URL } from "../../config";
// import Chatroom from './Chatroom'

const Alerts = () => {
  const { socket, setLoading, User } = useContext(StateContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [acceptedList, setAcceptedList] = useState([]);
  const [AlertList, setAlertList] = useState([]);

  const Get_SOS_details = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER_URL}/api/sos/details/${User.user_id}`
      );
      setAlertList(data);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Get_SOS_details();
    setLoading(false);
  }, [socket.connected]);

  useEffect(() => {
    socket.on("Refetch_SOS_Details", () => Get_SOS_details());
    return () => {
      socket.off("Refetch_SOS_Details");
    };
  }, [socket.connected]);

  const GetDirection = async (user_id, sos_id) => {
    if (!socket.connected) return alert("Please Connect to Socket");
    try {
      await axios.post(`${SERVER_URL}/api/sos/accepted`, { sos_id, user_id });
      const { data } = await axios.get(
        `${SERVER_URL}/api/active/location/${user_id}`
      );
      const url = `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}&travelmode=walking`;
      Linking.openURL(url);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, flex: 3.3 / 4 }}>
      {AlertList.length === 0 || AlertList[0] === null ? (
        <Text style={styles.silent}>No Alerts</Text>
      ) : (
        <FlatList
          data={AlertList}
          renderItem={({ item }) => {
            return (
              item !== null && (
                <View style={styles.card}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.raisedBy}>Raised By : </Text>
                    <Text style={styles.rbName}>{item.user.name}</Text>
                  </View>
                  <Text style={{ ...styles.raisedBy }}>
                    Phone Number : {item.user.phone_number}
                  </Text>
                  <Text style={styles.raisedBy}>
                    Time : {new Date(item.createdAt).toLocaleString()}
                  </Text>
                  {User.user_id !== item.user._id && (
                    <TouchableOpacity
                      style={styles.btn}
                      onPress={() => GetDirection(User.user_id, item._id)}
                    >
                      <Text style={styles.btnText}>Get Directions</Text>
                    </TouchableOpacity>
                  )}
                  {/* <Chatroom
                    socket={socket}
                    sos_id={item._id}
                    user_name={item.user.name}
                  /> */}
                  <TouchableOpacity
                    style={styles.btn}
                    onPress={async () => {
                      try {
                        const { data } = await axios.get(
                          `${SERVER_URL}/api/sos/accepted/${item._id}`
                        );
                        setAcceptedList(data);
                        setModalVisible(true);
                      } catch (error) {
                        alert(error);
                      }
                    }}
                  >
                    <Text style={styles.btnText}>Accepted Users</Text>
                  </TouchableOpacity>
                  <SafeAreaView>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          paddingHorizontal: 20,
                          backgroundColor: "#00000080",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#fff",
                            padding: 20,
                            borderRadius: 15,
                            elevation: 5,
                            shadowColor: "#c6c6c678",
                            marginVertical: 5,
                            shadowOffset: {
                              width: 0,
                              height: 2,
                            },
                          }}
                        >
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={styles.modal_head}>Accepted User</Text>
                            <TouchableOpacity
                              style={{ padding: 15, paddingTop: 0 }}
                              onPress={() => setModalVisible(false)}
                            >
                              <Image
                                source={require("../../assets/icons/close.png")}
                                resizeMode="contain"
                                style={{
                                  width: 16,
                                  height: 16,
                                  alignSelf: "flex-end",
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                          {acceptedList.length !== 0 ? (
                            <FlatList
                              data={acceptedList}
                              renderItem={(user) => {
                                return (
                                  <View
                                    style={{
                                      marginBottom: 10,
                                    }}
                                  >
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Text style={styles.raisedBy}>
                                        Person :{" "}
                                      </Text>
                                      <Text style={styles.rbName}>
                                        {user.item.name}
                                      </Text>
                                    </View>
                                    <Text
                                      style={{
                                        ...styles.raisedBy,
                                      }}
                                    >
                                      Phone Number : {user.item.phone_number}
                                    </Text>
                                  </View>
                                );
                              }}
                              showsVerticalScrollIndicator={false}
                            />
                          ) : (
                            <Text style={{ ...Styles.medium, fontSize: 15 }}>
                              No Accepted User
                            </Text>
                          )}
                        </View>
                      </View>
                    </Modal>
                  </SafeAreaView>
                </View>
              )
            );
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  title: {
    ...Styles.medium,
    fontSize: 30,
    marginTop: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    marginVertical: 10,
  },
  raisedBy: {
    ...Styles.medium,
    fontSize: 15,
  },
  rbName: {
    ...Styles.bold,
    textTransform: "capitalize",
  },
  btn: {
    backgroundColor: "#FFAACF",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  btnText: {
    ...Styles.medium,
  },
  silent: {
    ...Styles.medium,
    fontSize: 20,
    color: "#aaa",
    marginTop: 20,
    textAlign: "center",
    marginTop: "70%",
  },
  modal_head: {
    ...Styles.medium,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
});
