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

const Register2 = ({ route, navigation }) => {
  const { cred } = route.params;
  const [register, setRegister] = useState({
    name: "",
    email_address: cred.email_address,
    phone_number: "",
    emergency_contacts: "",
    password: cred.password,
  });
  const handleLogin = async () => {
    console.log(register);
    try {
      const { data } = await axios.post(
        "http://192.168.0.105:8000/api/register",
        {
          name: register.name,
          email_address: register.email_address,
          phone_number: register.phone_number,
          emergency_contact: [register.emergency_contacts],
          password: register.password,
        }
      );
      console.log(data);
      register = {
        name: "",
        email_address: "",
        phone_number: "",
        emergency_contacts: "",
        password: "",
      };
    } catch (error) {
      console.log(error);
    }
    // navigation.navigate("login");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>
          Tell us more about you :)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setRegister({ ...register, name: text })}
          value={register.name}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          onChangeText={(text) =>
            setRegister({ ...register, phone_number: text })
          }
          value={register.phone_number}
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact 1"
          keyboardType="numeric"
          onChangeText={(text) =>
            setRegister({ ...register, emergency_contacts: text })
          }
          value={register.emergency_contacts}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
            Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default Register2;

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: "#fff",
    flex: 1,
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: 100,
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
    fontSize: 30,
    textAlign: "center",
    marginBottom: 50,
  },
});
