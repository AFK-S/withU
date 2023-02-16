import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Audio } from "expo-av";
import Styles from "../../CommonStyles";
import * as SMS from "expo-sms";
import call from "react-native-phone-call";

const SOS = ({ socket, User }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSOS, setIsSOS] = useState(false);

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
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
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

  const triggerCall = (phone_number) => {
    if (phone_number.length != 10) {
      return console.error("Invalid Number");
    }
    call({
      number: phone_number,
      prompt: true,
    }).catch(console.error);
  };

  const OnSOS = async () => {
    setIsSOS(!isSOS);
    const { user_id, emergency_contact } = User;
    if (isSOS) {
      return socket.emit("SOS_Cancel", user_id, (user_details) => {
        const message = `I am ${user_details.name} and I am not in danger anymore.`;
        SendSMS(emergency_contact, message);
      });
    }
    socket.emit("SOS_button", user_id, emergency_contact, (user_details) => {
      const message = `I am ${user_details.name
        } and I am in danger. Please help me. My location is https://www.google.com/maps/search/?api=1&query=${user_details.coordinates.latitude
        },${user_details.coordinates.longitude} and my contact number is ${user_details.phone_number
        }.\n Send at ${new Date(user_details.time).toLocaleString()}`;
      SendSMS(emergency_contact, message);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            padding: 30,
            marginBottom: "10%"
          }}
        >
          <TouchableOpacity style={styles.onlySosButton} onPress={playSound}>
            <Text style={styles.onlySosButtonText}>
              {isPlaying ? "Stop Siren" : "Play Siren"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.onlySosButton}
            onPress={() => triggerCall(User.emergency_contact[0])}
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
    marginBottom: 100,
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
    fontSize: 15,
    fontFamily: Styles.medium.fontFamily,
  },
  onlySosButton: {
    backgroundColor: "#F0A04B",
    width: 200,
    height: 60,
    borderRadius: 200,
    justifyContent: "center",
    marginVertical: 10
  },
});

export default SOS;
