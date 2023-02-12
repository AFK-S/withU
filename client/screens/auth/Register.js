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

const Register = ({ navigation }) => {
  const [register, setRegister] = useState({
    email_address: "",
    password: "",
  });

  const handleLogin = () => {
    navigation.navigate("register2", { cred: register });
    setRegister({
      email_address: "",
      password: "",
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          onChangeText={(text) =>
            setRegister({ ...register, email_address: text })
          }
          value={register.email_address}
          autoCapitalize="none"
          autoComplete="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setRegister({ ...register, password: text })}
          autoCapitalize="none"
          autoComplete="none"
          value={register.password}
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("login")}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: Styles.medium.fontFamily,
            }}
          >
            Back to Login
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

export default Register;
