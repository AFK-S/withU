const fs = require('fs')
const { NearbyUsers, FamilyMembers } = require('../functions')
const UserSchema = require('../models/User')
const SOSSchema = require('../models/SOS')

const SOS = (io, socket) => {
  socket.on('On_SOS', async (description, callback) => {
    if (!socket.user_id) {
      return callback({
        err: true,
        msg: 'User not found',
      })
    }
    const users = await JSON.parse(fs.readFileSync('./cache.json'))
    const user_response = await UserSchema.findById(socket.user_id).lean()
    if (user_response === null) {
      return callback({
        err: true,
        msg: 'User not found',
      })
    }
    const nearby_users = await NearbyUsers(socket)
    const family_members = await FamilyMembers(socket, callback)
    const SOS_response = await SOSSchema.create({
      owner_id: socket.user_id,
      coordinates: users[socket.user_id].coordinates,
      user_ids: [...new Set([...nearby_users[0], ...family_members[0]])],
      description,
    })
    const user_detail = {
      user_id: SOS_response.owner_id,
      name: user_response.name,
      coordinates: SOS_response.coordinates,
      time: SOS_response.createdAt,
    }
    if (nearby_users[1] && family_members[1]) {
      socket
        .to([...new Set([...nearby_users[1], ...family_members[1]])])
        .emit('Send_Notification', user_detail)
    }
    io.emit('Refetch_SOS_Details')
    callback(user_detail)
  })
  socket.on('SOS_Cancel', async (callback) => {
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: socket.user_id,
        status: { $ne: 'resolved' },
      },
      {
        status: 'resolved',
      },
    )
    const user_response = await UserSchema.findById(socket.user_id).lean()
    io.emit('Refetch_SOS_Details')
    callback(user_response.name)
  })
}

module.exports = SOS
