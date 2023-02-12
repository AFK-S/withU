const { Server } = require("socket.io");
const fs = require("fs");
const SOS = require("../socket/SOS");

const socket = (http) => {
  const io = new Server(http);

  io.on("connection", (socket) => {
    socket.on("Set_Active_Users", async (user_id, coordinates) => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      users[socket.id] = {
        socket_id: socket.id,
        user_id: user_id,
        coordinates: coordinates,
      };
      fs.writeFileSync("./json/isActive.json", JSON.stringify(users));
    });
    socket.on("Get_Active_Users", async (callback) => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      callback(Object.values(users));
    });
    SOS(socket);
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
