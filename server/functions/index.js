const fs = require('fs')
const geolib = require('geolib')
const { METER_RADIUS } = '../config'
const UserSchema = require('../models/User')

const NearbyUsers = async () => {
  const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
  const closest_users = Object.values(users)
    .map((user) => {
      const distance = geolib.getDistance(
        users[socket.user_id].coordinates,
        user.coordinates,
      )
      if (distance / 1000 <= METER_RADIUS) {
        return {
          socket_id: user.socket_id,
          user_id: user.user_id,
          coordinates: user.coordinates,
          distance: distance,
        }
      }
    })
    .sort((a, b) => a.distance - b.distance)
  const user_ids = closest_users.map((user) => {
    if (user) return user.user_id
  })
  const socket_ids = closest_users.map((user) => {
    if (user) return user.socket_id
  })
  return [user_ids, socket_ids]
}

const FamilyMembers = async (callback) => {
  const user_response = await UserSchema.findById(socket.user_id).lean()
  if (user_response === null) {
    callback('Invalid Request')
    return
  }
  const user_ids = await UserSchema.find({
    phone_number: user_response.emergency_contact,
  }).distint('_id')
  const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
  const socket_ids = Object.values(users).map((user) => {
    if (user_ids.includes(user.user_id)) return user.socket_id
  })
  return [user_ids, socket_ids]
}

module.exports = { NearbyUsers, FamilyMembers }
