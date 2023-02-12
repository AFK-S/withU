import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import Styles from "../../CommonStyles";
import axios from "axios";

const LoginForm = ({ navigation }) => {
  const [login, setLogin] = useState({
    email_address: "",
    password: "",
  });

  const handleLogin = async () => {
    console.log(login);
    try {
      const { data } = await axios.put(
        "http://192.168.0.105:8000/api/login",
        login
      );
      console.log(data);
      login = {
        email_address: "",
        password: "",
      };
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>withU</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={(text) => setLogin({ ...login, email_address: text })}
          value={login.email_address}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setLogin({ ...login, password: text })}
          value={login.password}
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20 }}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 50,
    marginBottom: 30,
    paddingHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    backgroundColor: "#2980b9",
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: Styles.bold.fontFamily,
    fontSize: 18,
  },
  title: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 50,
  },
});

export default LoginForm;
