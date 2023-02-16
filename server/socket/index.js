const { Server } = require("socket.io");
const fs = require("fs");
const SOS = require("../socket/SOS");

const socket = (http) => {
  const io = new Server(http);

  fs.watch("json/isActive.json", async (eventType) => {
    if (eventType === "change") {
      fs.readFile("./json/isActive.json", "utf8", (err, data) => {
        if (err) {
          return console.log(err);
        }
        if (!data) return;
        const users = JSON.parse(data);
        io.emit("Send_Active_Users", Object.values(users));
      });
    }
  });

  io.on("connection", (socket) => {
    socket.on("Set_Active_User", async (user, coordinates) => {
      const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
      users[user.user_id] = {
        socket_id: socket.id,
        user_id: user.user_id,
        name: user.name,
        phone_number: user.phone_number,
        gender: user.gender,
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
