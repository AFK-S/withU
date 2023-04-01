const Chat = (socket) => {
  socket.on("join-room", async (sos_id, user_name) => {
    socket.join(sos_id);
    socket.to(sos_id).emit("new-user", `${user_name} has joined the chat`);
  });
  socket.on("send-message", async (message, user_name, sos_id) => {
    socket.to(sos_id).emit("receive-message", {
      message: message,
      username: user_name,
      createdAt: new Date(),
    });
  });
};

module.exports = Chat;
