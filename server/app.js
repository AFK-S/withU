require('dotenv').config()
require('events').EventEmitter.defaultMaxListeners = 100
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const socket = require('./socket')
const cookieParser = require('cookie-parser')
const net = require('net')
const fs = require('fs')
const geolib = require('geolib')
const { METER_RADIUS } = require('./config')
const SOSSchema = require('./models/SOS')

const port = process.env.PORT || 8000
const app = express()
const http = require('http').Server(app)

try {
  mongoose.set('strictQuery', false)
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log('Connected to database')
} catch (error) {
  console.log(error)
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

app.use('/api', require('./routes/index'))
app.use('/api', require('./routes/Credentials'))
app.use('/api', require('./routes/SOS'))
app.use('/api', require('./routes/Active'))
app.use('/api', require('./routes/Police'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

socket(http)

http.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const NearbyUsers = async (user_id) => {
  const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
  const closest_users = Object.values(users)
    .map((user) => {
      const distance = geolib.getDistance(
        users[user_id].coordinates,
        user.coordinates,
      )
      if (distance <= METER_RADIUS) {
        return {
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
  return user_ids
}

const server = net.createServer(function (client) {
  console.log('client connected from', client.remoteAddress, client.remotePort)
  client.on('data', async function (data) {
    console.log('received:', data.toString())
    if (data.toString().length !== 24) return
    const user_id = data.toString()
    const users = await JSON.parse(fs.readFileSync('./json/isActive.json'))
    const nearby_users = await NearbyUsers(user_id)
    await SOSSchema.create({
      owner_id: user_id,
      coordinates: users[user_id].coordinates,
      user_ids: [...new Set([...nearby_users])],
    })
    console.log('DONE')
  })
  client.on('close', function () {
    console.log('client disconnected')
  })
})

server.listen(8080, function () {
  console.log('server started on port 8080')
})
