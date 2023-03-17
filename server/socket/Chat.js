const ChatSchema = require('../models/ChatSchema')

const Chat = (socket) => {
  socket.on('join-room', async (sos_id, user_name) => {
    socket.join(sos_id)
    const previousMessages = await ChatSchema.find({ sos_id })
    socket.emit('previous-messages', previousMessages)
    socket.to(sos_id).emit('new-user', `${user_name} has joined the chat`)
  })
  socket.on('send-message', async (message, user_name, sos_id) => {
    const chat_response = new Chat({ sos_id, message, user_name })
    await chat_response.save()
    socket.to(sos_id).emit('receive-message', {
      message: msg,
      username: user_name,
      createdAt: chat_response.createdAt,
    })
  })
}

module.exports = Chat
