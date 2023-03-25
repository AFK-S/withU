import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import axios from "axios";
import Styles from "../../CommonStyles";
import { Picker } from "@react-native-picker/picker";

const Register = ({ route, navigation, setIsLogin }) => {
  const { cred, setCred } = route.params;
  const [register, setRegister] = useState({
    name: cred.name,
    email_address: cred.email_address,
    phone_number: "",
    gender: "",
    emergency_contact1: "",
    emergency_contact2: "",
    password: cred.password,
  });

  const onSubmit = async () => {
    try {
      const { data } = await axios.post(
        "http://192.168.0.110:8000/api/register",
        {
          name: register.name,
          email_address: register.email_address,
          phone_number: register.phone_number,
          gender: register.gender,
          emergency_contact: [
            register.emergency_contact1,
            register.emergency_contact2,
          ],
          password: register.password,
        }
      );
      await AsyncStorage.setItem("user", JSON.stringify(data));
      setCred({
        name: "",
        email_address: "",
        password: "",
      });
      setRegister({
        name: "",
        email_address: "",
        phone_number: "",
        gender: "",
        emergency_contact1: "",
        emergency_contact2: "",
        password: "",
      });
      setIsLogin(true);
    } catch (err) {
      console.error(err.response.data);
      setAlert({
        isAlert: true,
        type: err.response.data.type,
        message: err.response.data,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={{ width: "100%", maxWidth: 500 }}>
        <Text style={[Styles.bold, styles.title]}>
          Tell us more about you :)
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="numeric"
          onChangeText={(text) =>
            setRegister({ ...register, phone_number: text })
          }
          value={register.phone_number}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Gender"
          onChangeText={(text) => setRegister({ ...register, gender: text })}
          value={register.gender}
          autoCapitalize="none"
          autoComplete="off"
        />
        <Picker
          editable={false}
          selectedValue={register.gender}
          onValueChange={(itemValue, itemIndex) =>
            setRegister({ ...register, gender: itemValue })
          }
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact 1"
          keyboardType="numeric"
          onChangeText={(text) =>
            setRegister({ ...register, emergency_contact1: text })
          }
          value={register.emergency_contact1}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TextInput
          style={styles.input}
          placeholder="Emergency Contact 2"
          keyboardType="numeric"
          onChangeText={(text) =>
            setRegister({ ...register, emergency_contact2: text })
          }
          value={register.emergency_contact2}
          autoCapitalize="none"
          autoComplete="off"
        />
        <TouchableOpacity
          onPress={onSubmit}
          style={{ ...Styles.button, marginTop: 10 }}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
            autoCapitalize="none"
            autoComplete="off"
          >
            Back
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
    paddingTop: 100,
  },
  title: {
    fontSize: 30,
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

export default Register;
