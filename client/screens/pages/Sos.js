import React, { useEffect, useState, useContext } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import Styles from "../../CommonStyles";
import * as SMS from "expo-sms";
import call from "react-native-phone-call";
import StateContext from "../../context/StateContext";

const SOS = () => {
  const { socket, Logout, User, isSocketConnected } = useContext(StateContext);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

  useEffect(() => {
    if (!isSocketConnected) return;
    socket.emit("Is_SOS", (boolean) => setIsSOS(boolean));
    return () => socket.off("Is_SOS");
  }, [isSocketConnected]);

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sos.mp3")
    );
    setSound(sound);
    if (isPlaying) {
      sound.stopAsync();
    } else {
      await sound.setIsLoopingAsync(true);
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
    });
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const SendSMS = (emergency_contact, message) => {
    SMS.sendSMSAsync(emergency_contact, message).catch((err) =>
      console.error(err)
    );
  };

  const OnSOS = async () => {
    if (!isSocketConnected) return;
    setIsSOS(!isSOS);
    const { emergency_contact } = User;
    if (isSOS) {
      return socket.emit("SOS_Cancel", (data) => {
        if (data.err) return alert(data.msg);
        const message = `I am ${data} and I am not in danger anymore.`;
        SendSMS(emergency_contact, message);
      });
    }
    socket.emit("On_SOS", (data) => {
      if (data.err) return alert(data.msg);
      const message = `I am ${
        data.name
      } and I am in danger. Please help me. My location is https://www.google.com/maps/search/?api=1&query=${
        data.coordinates.latitude
      },${data.coordinates.longitude}.\n Send at ${new Date(
        data.time
      ).toLocaleString()}`;
      SendSMS(emergency_contact, message);
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.logoutDiv}>
        <TouchableOpacity style={styles.logout} onPress={Logout}>
          <Image
            source={require("../../assets/logout-icon.png")}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View
          style={{
            borderColor: "red",
            borderWidth: 7,
            borderRadius: 200,
            padding: 15,
          }}
        >
          <TouchableOpacity style={styles.sosButton} onPress={OnSOS}>
            <Text style={styles.buttonText}>{isSOS ? "Cancel" : "SOS"}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
            marginTop: "10%",
          }}
        >
          <TouchableOpacity
            style={{
              ...styles.additionalSosButton,
              backgroundColor: "#F7AB48",
            }}
          >
            <Text> Accident</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.additionalSosButton,
              backgroundColor: "#FFAACF",
              borderColor: "#db88ac",
            }}
          >
            <Text> Normal</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 30,
            marginBottom: "10%",
            marginTop: "10%",
          }}
        >
          <TouchableOpacity style={styles.onlySosButton} onPress={playSound}>
            <Text style={styles.onlySosButtonText}>
              {isPlaying ? "Stop Siren" : "Play Siren"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "#2E2E2E",
              width: 250,
              height: 60,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              justifyContent: "center",
              marginVertical: 10,
            }}
            onPress={() =>
              call({
                number: User.emergency_contact[0],
                prompt: true,
              }).catch(console.error)
            }
          >
            <Text style={styles.onlySosButtonText}>Emergency Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: "15%",
  },
  sosButton: {
    backgroundColor: "red",
    width: 200,
    height: 200,
    borderRadius: 200,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "red",
  },
  additionalSosButton: {
    backgroundColor: "orange",
    width: 90,
    height: 90,
    borderRadius: 200,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#c28b44",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 40,
    fontFamily: Styles.bold.fontFamily,
  },
  onlySosButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: Styles.medium.fontFamily,
  },
  onlySosButton: {
    marginBottom: 0,
    backgroundColor: "#2E2E2E",
    width: 250,
    height: 60,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    marginVertical: 10,
  },
  logoutDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingHorizontal: 30,
  },
  logout: {
    backgroundColor: "#FFAACF",
    padding: 15,
    borderRadius: 100,
  },
});

export default SOS;
