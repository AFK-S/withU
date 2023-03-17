const fs = require('fs')
const { NearbyUsers, FamilyMembers } = require('../functions')
const UserSchema = require('../models/User')

const SOS = (socket) => {
  socket.on('Is_SOS', async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    callback(sos_user[socket.user_id] ? true : false)
  })
  socket.on('On_SOS', async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
    const user_response = await UserSchema.findById(socket.user_id).lean()
    if (user_response === null) {
      callback('Invalid Request')
      return
    }
    const nearby_users = await NearbyUsers(socket)
    const family_members = await FamilyMembers(socket, callback)
    sos_user[socket.user_id] = {
      owner_id: socket.user_id,
      user_ids: [...new Set([...nearby_users[0], ...family_members[0]])],
      time: Date.now(),
    }
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    const user_detail = {
      user_id: socket.user_id,
      name: user_response.name,
      coordinates: users[socket.user_id].coordinates,
      time: sos_user[socket.user_id].time,
    }
    if (nearby_users[1] && family_members[1]) {
      socket
        .to([...new Set([...nearby_users[1], ...family_members[1]])])
        .emit('Send_Notification', user_detail)
    }
    callback(user_detail)
    // add to database sos
  })
  socket.on('SOS_Cancel', async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (sos_user[socket.user_id]) {
      delete sos_user[socket.user_id]
      fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    }
    const user_response = await UserSchema.findById(socket.user_id).lean()
    // active the sos from database
    socket.emit('Refetch_SOS_Details', true)
    callback(user_response.name)
  })
  socket.on('SOS_Accepted_Commity', async (sos_user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (!sos_user[sos_user_id]) {
      callback('Invalid Request')
      return
    }
    if (!sos_user[sos_user_id].accepted_list) {
      sos_user[sos_user_id].accepted_commity_list = []
    }
    sos_user[sos_user_id].accepted_list = [
      ...sos_user[sos_user_id].accepted_commity_list,
      socket.user_id,
    ]
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    socket.emit('Refetch_SOS_Details', true)
  })
  socket.on('SOS_Accepted_Officials', async (sos_user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (!sos_user[sos_user_id]) {
      callback('Invalid Request')
      return
    }
    if (!sos_user[sos_user_id].accepted_list) {
      sos_user[sos_user_id].accepted_officials_list = []
    }
    sos_user[sos_user_id].accepted_list = [
      ...sos_user[sos_user_id].accepted_officials_list,
      socket.user_id,
    ]
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    socket.emit('Refetch_SOS_Details', true)
  })
  socket.on('Get_SOS_details', async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    const sos_details = Object.values(sos_user).filter((user) => {
      return user.user_ids.includes(socket.user_id)
    })
    const owner_ids = sos_details.map((sos) => sos.owner_id)
    const user_detail = await UserSchema.find({
      _id: owner_ids,
    })
    callback(user_detail)
  })
}

module.exports = SOS
