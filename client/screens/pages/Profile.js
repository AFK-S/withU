import { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";
import StateContext from "../../context/StateContext";
import { SERVER_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { setLoading } = useContext(StateContext);
  const [user, setUser] = useState({
    name: "",
    emergency_contact1: "",
    emergency_contact2: "",
  });
  const { Logout } = useContext(StateContext);

  const getUserData = async () => {
    setLoading(true);
    try {
      const User = await JSON.parse(await AsyncStorage.getItem("user"));
      const { data } = await axios.get(
        `${SERVER_URL}/api/user/${User.user_id}`
      );
      setUser({
        name: data.name,
        emergency_contact1: data.emergency_contact[0],
        emergency_contact2: data.emergency_contact[1],
      });
    } catch (error) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
    setLoading(false);
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const User = await JSON.parse(await AsyncStorage.getItem("user"));
      await axios.put(`${SERVER_URL}/api/user/${User.user_id}`, {
        name: user.name,
        emergency_contact: [user.emergency_contact1, user.emergency_contact2],
      });
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          ...User,
          emergency_contact: [user.emergency_contact1, user.emergency_contact2],
        })
      );
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUserData();
  }, []);

  const keyboardVerticalOffset = Platform.OS === "ios" ? 130 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{ width: "100%" }}
      >
        <ScrollView style={{ width: "100%", marginBottom: 80 }}>
          <View style={styles.avatar}>
            <Image
              source={require("../../assets/icons/user.png")}
              resizeMode="contain"
              style={{
                width: 100,
                height: 100,
              }}
            />
          </View>
          <View
            style={{ width: "100%", alignItems: "center", marginTop: "10%" }}
          >
            <View style={styles.inputDiv}>
              <Text style={styles.inputTitle}>Name</Text>
              <TextInput
                placeholder="Name"
                style={styles.input}
                onChangeText={(text) => setUser({ ...user, name: text })}
                value={user.name}
              />
            </View>
            <View style={styles.inputDiv}>
              <Text style={styles.inputTitle}>Emergency Contact 1</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Emergency Contact 1"
                style={styles.input}
                onChangeText={(text) =>
                  setUser({ ...user, emergency_contact1: text })
                }
                value={user.emergency_contact1}
              />
            </View>
            <View style={styles.inputDiv}>
              <Text style={styles.inputTitle}>Emergency Contact 2</Text>
              <TextInput
                keyboardType="numeric"
                placeholder="Emergency Contact 2"
                style={styles.input}
                onChangeText={(text) =>
                  setUser({ ...user, emergency_contact2: text })
                }
                value={user.emergency_contact2}
              />
            </View>
            <TouchableOpacity
              onPress={updateProfile}
              style={{
                backgroundColor: "#f75459",
                padding: 20,
                borderRadius: 20,
                width: "80%",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={Logout}
              style={{
                borderWidth: 2,
                borderColor: "#f75459",
                padding: 20,
                borderRadius: 20,
                width: "80%",
                marginTop: 20,
              }}
            >
              <Text
                style={{
                  color: "#f75459",
                  fontSize: 18,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  avatar: {
    marginTop: "10%",
    width: 160,
    height: 160,
    borderRadius: 1000,
    backgroundColor: "#ffeded",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderStyle: "dashed",
    borderColor: "#f75459",
    alignSelf: "center",
  },
  inputDiv: {
    height: 75,
    margin: 12,
    borderWidth: 2,
    borderColor: "#bfbfbf",
    width: "80%",
    padding: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  inputTitle: {
    fontSize: 12,
    color: "#828282",
  },
  input: {
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Profile;
