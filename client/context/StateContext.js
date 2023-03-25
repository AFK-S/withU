import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect, createContext } from "react";
// import io from "socket.io-client";

const StateContext = createContext();
export default StateContext;

export const StateProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    isAlert: false,
    type: "",
    message: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

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
      } = JSON.parse(user);
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
      setIsLogin(true);
    })();
  }, [isLogin]);

  const Logout = async () => {
    await AsyncStorage.removeItem("user");
    setIsLogin(false);
  };

  return (
    <StateContext.Provider
      value={{
        loading,
        setLoading,
        alert,
        setAlert,
        isLogin,
        setIsLogin,
        Logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// const SocketProvider = ({ children }) => {
//   const socket = io("https://192.168.0.105:8000", {
//     transports: ["websocket"],
//   });

//   socket.on("connect", async () => {
//     const { user_id } = await JSON.parse(await AsyncStorage.getItem("user"));
//     socket.emit("Set_User_ID", user_id);
//     console.log("connected");
//     socket.emit("Is_SOS", (boolean) => setIsSOS(boolean));
//   });

//   socket.on("connect_error", (err) => {
//     console.log(err);
//   });

//   return (
//     <StateContext.Provider
//       value={{
//         socket,
//       }}
//     >
//       {children}
//     </StateContext.Provider>
//   );
// };
