import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, createContext, useContext } from "react";
import * as Location from "expo-location";
import io from "socket.io-client";

const StateContext = createContext();
export default StateContext;

export const StateProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [User, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("user");
      if (user === null) {
        return setIsLogin(false);
      }
      const {
        user_id,
        name,
        phone_number,
        gender,
        emergency_contact,
        password,
      } = await JSON.parse(user);
      if (
        !(
          user_id &&
          name &&
          phone_number &&
          gender &&
          emergency_contact &&
          password
        )
      ) {
        return setIsLogin(false);
      }
      setUser(await JSON.parse(user));
      setIsLogin(true);
    })();
  }, [isLogin]);

  return (
    <StateContext.Provider
      value={{
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        User,
        setUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const SocketProvider = ({ children }) => {
  const { setIsLogin, User, setUser, setLoading } = useContext(StateContext);

  const [socketLoading, setSocketLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [isSOS, setIsSOS] = useState(false);

  const socket = io("http://192.168.0.105:8000", {
    transports: ["websocket"],
  });

  const LocationUpdate = async () => {
    while (true) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return alert("Grant permission to access your location");
      }
      break;
    }
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 20,
      },
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        socket.emit("Set_Active_User", {
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        console.log("location updated");
      }
    );
    return () => subscription.remove();
  };

  socket.on("connect", async () => {
    socket.emit("Set_User_ID", await User.user_id);
    console.log("connected");
    socket.emit("Is_SOS", (boolean) => setIsSOS(boolean));
    setSocketLoading(false);
  });

  const [PoliceInfo, setPoliceInfo] = useState([]);
  const [SOSInfo, setSOSInfo] = useState([]);

  useEffect(() => {
    if (!socketLoading) {
      socket.emit("Get_Police", (data) => {
        setPoliceInfo(data);
      });
      socket.emit("Get_SOS", (data) => {
        setSOSInfo(data);
      });
    }
  }, [socketLoading]);

  socket.on("disconnect", () => {
    setSocketLoading(true);
  });

  socket.on("connect_error", (err) => {
    console.log(err);
    alert("Socket connection error");
  });

  useEffect(() => {
    (async () => {
      if (!socketLoading) {
        await LocationUpdate();
      }
    })();
  }, [socketLoading]);

  const Logout = async () => {
    await AsyncStorage.removeItem("user");
    setIsLogin(false);
  };

  const [AlertList, setAlertList] = useState([]);

  socket.on("Refetch_SOS_Details", () => {
    setLoading(true);
    socket.emit("Get_SOS_details");
  });

  socket.on("Pass_SOS_Details", (data) => {
    setAlertList(data);
    setLoading(false);
  });

  return (
    <StateContext.Provider
      value={{
        socketLoading,
        socket,
        location,
        setLocation,
        User,
        setUser,
        isSOS,
        setIsSOS,
        Logout,
        setLoading,
        PoliceInfo,
        SOSInfo,
        AlertList,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
