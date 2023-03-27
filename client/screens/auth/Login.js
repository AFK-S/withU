import {
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useContext } from "react";
import axios from "axios";
import Styles from "../../CommonStyles";
import StateContext from "../../context/StateContext";
import { SERVER_URL } from "../../config";

const Login = ({ navigation }) => {
  const { setIsLogin, setLoading } = useContext(StateContext);
  const [login, setLogin] = useState({
    email_address: "",
    password: "",
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.put(`${SERVER_URL}/api/login`, login);
      await AsyncStorage.setItem("user", JSON.stringify(data));
      setLogin({ email_address: "", password: "" });
      setIsLogin(true);
    } catch (err) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>withU</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={(text) => setLogin({ ...login, email_address: text })}
          value={login.email_address}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setLogin({ ...login, password: text })}
          autoCapitalize="none"
          autoComplete="off"
          value={login.password}
        />
        <TouchableOpacity
          onPress={onSubmit}
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate("register")}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: Styles.medium.fontFamily,
            }}
          >
            New to withU ? Register Here
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 50,
  },
  input: {
    height: 50,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: Styles.bold.fontFamily,
    fontSize: 18,
  },
});

export default Login;
