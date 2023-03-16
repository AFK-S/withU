const { METER_RADIUS } = '../config'

const Active = (socket) => {
  socket.on('Set_Active_Users', async (coordinates) => {
    const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
    users[socket.user_id] = {
      socket_id: socket.id,
      user_id: socket.user_id,
      coordinates: coordinates,
    }
    fs.writeFileSync('./json/isActive.json', JSON.stringify(users))
  })
  socket.on('Get_Meter_Active_Users', async (callback) => {
    const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
    const closest_users = Object.values(users)
      .map((user) => {
        const distance = geolib.getDistance(
          users[socket.user_id].coordinates,
          user.coordinates,
        )
        if (distance / 1000 <= METER_RADIUS) {
          return {
            user_id: user.user_id,
            coordinates: user.coordinates,
            distance: distance,
          }
        }
      })
      .sort((a, b) => a.distance - b.distance)
    callback(closest_users)
  })
  socket.on('Get_All_Active_Users', async (callback) => {
    const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
    callback(Object.values(users))
  })
}

module.exports = Active
