const { Server } = require("socket.io");
const fs = require("fs");
const SOSSocket = require("../socket/SOS");
const UserSchema = require("../models/User");
const PoliceSocket = require("../socket/Police");
const ChatSocket = require("../socket/Chat");

const socket = (http) => {
  const io = new Server(http);

  fs.watch("json/isActive.json", async (eventType) => {
    if (eventType === "change") {
      io.emit("Update_Active_Users");
    }
  });

  io.on("connection", (socket) => {
    socket.on("Set_User_ID", (user_id) => {
      socket.user_id = user_id;
    });
    socket.on("Get_User_Details", async (user_id, callback) => {
      const user_detail = await UserSchema.findById(user_id).lean();
      if (user_response === null) {
        return callback({
          err: true,
          msg: "User not found",
        });
      }
      callback(user_detail);
    });
    socket.on("Set_Active_User", async (coordinates) => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      users[socket.user_id] = {
        socket_id: socket.id,
        user_id: socket.user_id,
        coordinates: coordinates,
      };
      fs.writeFileSync("./json/isActive.json", JSON.stringify(users));
    });
    SOSSocket(io, socket);
    PoliceSocket(socket);
    ChatSocket(io, socket);
    socket.on("disconnect", async () => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      for (const user_id in users) {
        if (users[user_id].socket_id === socket.id) {
          delete users[user_id];
          fs.writeFileSync("./json/isActive.json", JSON.stringify(users));
          break;
        }
      }
    });
  });
};

module.exports = socket;
