import { View, Text, SafeAreaView, StatusBar, Platform } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import CommonStyles from "../../CommonStyles";
import { Ionicons } from "@expo/vector-icons";
import AllStories from "./AllStories";
import MyStories from "./MyStories";

const Story = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <SafeAreaView style={{ ...CommonStyles.container }}>
      <Tab.Navigator
        style={{
          paddingTop: Platform.OS === "ios" ? StatusBar.currentHeight : 0,
        }}
      >
        <Tab.Screen
          options={{
            title: ({ color, focused }) => (
              <Text
                style={{
                  fontWeight: focused ? "bold" : "normal",
                  paddingHorizontal: 15,
                }}
              >
                All Stories
              </Text>
            ),
          }}
          component={AllStories}
          name="AllStories"
        />
        <Tab.Screen
          options={{
            title: ({ focused, fontWeight }) => (
              <Text
                style={{
                  fontWeight: focused ? "bold" : "normal",
                }}
              >
                My Stories
              </Text>
            ),
          }}
          component={MyStories}
          name="MyStories"
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Story;
