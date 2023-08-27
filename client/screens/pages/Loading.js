import React, { useContext } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import StateContext from "../../context/StateContext";

const Loading = () => {
  const { loading } = useContext(StateContext);

  return (
    loading && (
      <View style={styles.container}>
        <ActivityIndicator
          animating={loading}
          color="#7d40ff"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
    )
  );
};
export default Loading;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  activityIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
});
