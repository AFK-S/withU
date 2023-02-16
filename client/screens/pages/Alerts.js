import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Styles from "../../CommonStyles";

const Alerts = ({ socket, User }) => {
  const [AlertList, setAlertList] = useState([]);

  socket.emit("Get_SOS_details", User.user_id, (data) => {
    setAlertList(data);
  });

  return (
    <View style={{ paddingHorizontal: 20, flex: 3.3 / 4 }}>
      <FlatList
        data={AlertList}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Text style={styles.raisedBy}>Raised By : </Text>
                <Text style={styles.rbName}>{item.name}</Text>
              </View>
              <Text style={{ ...styles.raisedBy, marginVertical: 10 }}>
                Location : {JSON.stringify(item.coordinates)}
              </Text>
              <Text style={styles.raisedBy}>
                Time : {new Date(item.time).toLocaleString()}
              </Text>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
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
});
