import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import CommonStyles from "../CommonStyles";
import axios from "axios";

const Chatbot = ({ modalVisible, setModalVisible }) => {
  const [message, setMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState("");
  const [anonymous_alert, setAnonymous_alert] = useState({
    type: "",
    description: "",
  });

  const onSubmit = async () => {
    try {
      const { data } = await axios.get(`${SERVER_URL}/api/chatbot/${message}`);
      setMessage("");
      setTypeAlert(data.type);
      console.log(data);
    } catch (err) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
  };
  const CreateAnonymousAlert = async () => {
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/api/register/anonymous_alert`,
        anonymous_alert
      );
      setAnonymous_alert({
        type: "",
        description: "",
      });
      alert(data);
    } catch (err) {
      console.error(err);
      if (err.response) return alert(err.response.data);
      alert(err);
    }
  };
  const keyboardVerticalOffset = Platform.OS === "ios" ? 0 : 0;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                }}
              >
                <Image
                  source={require("../assets/icons/close.png")}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    ...CommonStyles.bold,
                    fontSize: 30,
                  }}
                >
                  Chatbot
                </Text>
              </View>
            </View>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={keyboardVerticalOffset}
              style={{ width: "100%" }}
            >
              <View
                style={{
                  width: "100%",
                  height: "90%",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <ScrollView
                  style={{
                    paddingVertical: 20,
                    marginBottom: 30,
                  }}
                >
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                  <Text>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  </Text>
                </ScrollView>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <TextInput
                    placeholder="Name"
                    onChangeText={(text) => {
                      setMessage(text);
                    }}
                    value={message}
                    style={{
                      ...CommonStyles.input,
                      width: "80%",
                      paddingVertical: 15,
                      fontSize: 15,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      onSubmit();
                    }}
                  >
                    <Text>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "100%",
    overflow: "hidden",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 40,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    justifyContent: "space-between",
  },
});

export default Chatbot;
