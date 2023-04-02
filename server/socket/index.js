const { Server } = require('socket.io')
const fs = require('fs')
const SOSSocket = require('../socket/SOS')

const socket = (http) => {
  const io = new Server(http)

  fs.watch('json/isActive.json', async (eventType) => {
    if (eventType === 'change') {
      io.emit('Update_Active_Users')
    }
  })

  io.on('connection', (socket) => {
    socket.on('Set_User_ID', (user_id) => {
      socket.user_id = user_id
    })
    socket.on('Set_Active_User', async (coordinates) => {
      const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
      users[socket.user_id] = {
        socket_id: socket.id,
        user_id: socket.user_id,
        coordinates: coordinates,
      }
      fs.writeFileSync('./json/isActive.json', JSON.stringify(users))
    })
    SOSSocket(io, socket)
    socket.on('join-room', (sos_id) => {
      socket.join(sos_id)
    })
    socket.on('send-message', (message, sos_id, user_id, user_name) => {
      socket.to(sos_id).emit('receive-message', {
        message: message,
        user_id: user_id,
        name: user_name,
      })
    })
    socket.on('disconnect', async () => {
      const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
      for (const user_id in users) {
        if (users[user_id].socket_id === socket.id) {
          delete users[user_id]
          fs.writeFileSync('./json/isActive.json', JSON.stringify(users))
          break
        }
      }
    })
  })
}

module.exports = socket
