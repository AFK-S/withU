const fs = require('fs')
const { NearbyUsers, FamilyMembers } = require('../functions')
const UserSchema = require('../models/User')
const SOSSchema = require('../models/SOS')

const SOS = (io, socket) => {
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
    let SOS_response
    try {
      SOS_response = await SOSSchema.create({
        owner_id: socket.user_id,
        coordinates: users[socket.user_id].coordinates,
      })
    } catch (error) {
      callback(error)
      return
    }
    sos_user[socket.user_id] = {
      sos_id: SOS_response._id,
      user_ids: [...new Set([...nearby_users[0], ...family_members[0]])],
    }
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
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
    try {
      await SOSSchema.findOneAndUpdate(
        {
          owner_id: socket.user_id,
        },
        {
          status: 'resolved',
        },
      )
    } catch (error) {
      callback(error)
      return
    }
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (sos_user[socket.user_id]) {
      delete sos_user[socket.user_id]
      fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    }
    io.emit('Refetch_SOS_Details')
    const user_response = await UserSchema.findById(socket.user_id).lean()
    callback(user_response.name)
  })
  socket.on('SOS_Accepted_Commity', async (sos_user_id) => {
    const sos_response = await SOSSchema.findOne({
      owner_id: sos_user_id,
      status: 'accepted',
    })
    if (sos_response !== null) {
      return
    }
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: sos_user_id,
        status: 'pending',
      },
      {
        status: 'accepted',
      },
    )
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (!sos_user[sos_user_id].accepted_commity_list) {
      sos_user[sos_user_id].accepted_commity_list = []
    }
    sos_user[sos_user_id].accepted_commity_list = [
      ...sos_user[sos_user_id].accepted_commity_list,
      socket.user_id,
    ]
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    io.emit('Refetch_SOS_Details')
  })
  socket.on('Get_SOS_details', async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    const sos_details_list = Object.values(sos_user).filter((user) => {
      return user.user_ids.includes(socket.user_id)
    })
    const sos_ids = sos_details_list.map((sos) => {
      return sos.sos_id
    })
    const sos_response = await SOSSchema.aggregate([
      {
        $addFields: {
          id: {
            $toString: '$_id',
          },
        },
      },
      {
        $match: {
          id: { $in: sos_ids },
        },
      },
      {
        $addFields: {
          owner_id: {
            $toObjectId: '$owner_id',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
    ])
    callback(sos_response)
  })
  socket.on('Get_SOS_Accepted_List', async (sos_owner_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    const get_commity_list = sos_user[sos_owner_id].accepted_commity_list
    const sos_accepted_detail = await UserSchema.find({
      _id: { $in: get_commity_list },
    }).lean()
    callback(sos_accepted_detail)
  })
}

module.exports = SOS
