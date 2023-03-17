const fs = require('fs')
const SOSSchema = require('../models/SOS')
const PoliceSchema = require('../models/Police')
const UserSchema = require('../models/User')
const { METER_RADIUS } = require('../config')
const geolib = require('geolib')

const SOS = (io, socket) => {
  socket.on('SOS_Accepted_Officials', async (user_id, sos_user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync('./json/isSOS.json'))
    if (!sos_user[sos_user_id].accepted_officials_list) {
      sos_user[sos_user_id].accepted_officials_list = []
    }
    if (sos_user[sos_user_id].accepted_officials_list.includes(user_id)) {
      return
    }
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: socket.user_id,
        status: 'pending',
      },
      {
        status: 'accepted',
      },
    )
    sos_user[sos_user_id].accepted_list = [
      ...sos_user[sos_user_id].accepted_officials_list,
      user_id,
    ]
    fs.writeFileSync('./json/isSOS.json', JSON.stringify(sos_user))
    io.emit('Refetch_SOS_Details')
  })
  socket.on('Get_SOS_Officials', async (user_id, callback) => {
    const officer_response = await PoliceSchema.findById(user_id)
    if (officer_response === null) {
      return
    }
    const sos_response = await SOSSchema.find().lean()
    const closest_users_sos = sos_response.map((sos) => {
      const distance = geolib.getDistance(
        officer_response.coordinates,
        sos.coordinates,
      )
      if (distance / 1000 <= METER_RADIUS) return sos.owner_id
    })
    const user_detail = await UserSchema.find({
      _id: { $in: closest_users_sos },
    }).lean()
    callback(user_detail)
  })
}

module.exports = SOS
