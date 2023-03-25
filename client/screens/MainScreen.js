import { View, Image, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState, useEffect, useRef, useContext } from "react";
import Sos from "./pages/Sos";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import Help from "./pages/Help";
import * as Notifications from "expo-notifications";
import StateContext from "../context/StateContext";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// })
const MainScreen = () => {
  const { socket } = useContext(StateContext);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  socket.on("Send_Notification", async (details) => {
    console.log("notification received");
    // await schedulePushNotification(details)
  });

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))
  //   notificationListener.current = Notifications.addNotificationReceivedListener(
  //     (notification) => {
  //       setNotification(notification)
  //     },
  //   )
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener()
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current)
  //     Notifications.removeNotificationSubscription(responseListener.current)
  //   }
  // }, [])

  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="SOS"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 30,
          left: 30,
          right: 30,
          elevation: 0,
          backgroundColor: "#FFAACF",
          borderRadius: 25,
        },
      }}
    >
      <Tab.Screen
        name="MAP"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "android" ? 0 : 15,
                backgroundColor: focused ? "#fff" : "transparent",
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "android" ? 0 : 15,
                backgroundColor: focused ? "#fff" : "transparent",
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require("../assets/icons/map.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
        component={Map}
      />
      <Tab.Screen
        name="SOS"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "android" ? 0 : 15,
                backgroundColor: focused ? "#fff" : "transparent",
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require("../assets/icons/alert.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
        component={Sos}
      />
      <Tab.Screen
        name="ALERTS"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "android" ? 0 : 15,
                backgroundColor: focused ? "#fff" : "transparent",
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require("../assets/icons/sos.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
        component={Alerts}
      />
      <Tab.Screen
        name="HELP"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: Platform.OS === "android" ? 0 : 15,
                backgroundColor: focused ? "#fff" : "transparent",
                padding: 20,
                borderRadius: 15,
                aspectRatio: 1,
              }}
            >
              <Image
                source={require("../assets/icons/police.png")}
                resizeMode="contain"
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            </View>
          ),
        }}
        component={Help}
      />
    </Tab.Navigator>
  );
};

// async function schedulePushNotification(details) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'I am in danger',
//       body: `Sent by ${details.name}`,
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   })
// }

// async function registerForPushNotificationsAsync() {
//   const { status } = await Notifications.requestPermissionsAsync()
//   if (status !== 'granted') {
//     console.log('Failed to get push token for push notification!')
//     return
//   }
//   const token = (await Notifications.getExpoPushTokenAsync()).data
//   return token
// }

export default MainScreen;
