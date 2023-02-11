const { Server } = require("socket.io");

const socket = (http) => {
  const io = new Server(http);

  io.on("connection", (socket) => {
    socket.on("new_room", async (room, user) => {
      socket.join(room);
      console.log("new room created by " + user);
      io.to(room).emit("room", room);
    });
    socket.on("send", async (room, text) => {
      console.log("text is: " + text);
      socket.to(room).emit("receive", text);
    });
  });
};

module.exports = socket;
