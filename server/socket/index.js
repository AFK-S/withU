const { Server } = require("socket.io");
const fs = require("fs");

const socket = (http) => {
  const io = new Server(http);

  io.on("connection", (socket) => {
    socket.on("isActive", async (user_id, coordinates) => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      users[socket.id] = {
        user_id: user_id,
        coordinates: coordinates,
      };
      fs.writeFileSync("./json/isActive.json", JSON.stringify(users));
    });
    socket.on("SOS_button", async (user_id, user) => {
      socket.join(user_id);
      const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
      sos_user[user_id] = user;
      fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
      io.to(user_id).emit("room", user_id);
    });
    socket.on("send", async (room, text) => {
      console.log("text is: " + text);
      socket.to(room).emit("receive", text);
    });
    socket.on("disconnect", async () => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      if (users[socket.id]) {
        delete users[socket.id];
        fs.writeFileSync("./json/isActive.json", JSON.stringify(users));
      }
    });
  });
};

module.exports = socket;
