const { Server } = require('socket.io')
const fs = require('fs')
const SOSSocket = require('../socket/SOS')
const ActiveSocket = require('../socket/Active')
const UserSchema = require('../models/User')

const socket = (http) => {
  const io = new Server(http)

  fs.watch('json/isActive.json', async (eventType) => {
    if (eventType === 'change') {
      const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
      io.emit('Send_Active_Users', Object.values(users))
    }
  })

  io.on('connection', (socket) => {
    socket.on('Set_User_ID', (user_id) => {
      socket.user_id = user_id
    })
    socket.on('Get_User_Details', async (user_id, callback) => {
      const user_detail = await UserSchema.findById(user_id).lean()
      if (user_response === null) {
        callback('Invalid Request')
        return
      }
      callback(user_detail)
    })
    ActiveSocket(socket)
    SOSSocket(socket)
    // done
    // get password
    socket.on('Get_Location', async (user_id, callback) => {
      const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
      callback(users[user_id].coordinates)
    })
    socket.on(
      'Get_Direction_Location',
      async (sos_user_id, person_user_id, callback) => {
        const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
        callback({
          source: users[sos_user_id].coordinates,
          destination: users[person_user_id].coordinates,
        })
      },
    )
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
