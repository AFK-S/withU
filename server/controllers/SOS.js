const AdministratorSchema = require('../models/Administrator')
const UserSchema = require('../models/User')
const SOSSchema = require('../models/SOS')

const GetMarkers = async (req, res) => {
  try {
    const administrator_response = await AdministratorSchema.find().lean()
    const sos_response = await SOSSchema.find({
      status: 'resolved',
    }).lean()
    res.json({
      administrator_response,
      sos_response,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const SOSAcceptedCount = async (req, res) => {
  const { user_id } = req.params
  try {
    const user_response = await SOSSchema.findOne({
      owner_id: user_id,
      status: { $ne: 'resolved' },
    }).lean()
    if (!user_response) return res.send('0')
    res.send(user_response.accepted_list.length.toString())
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const IsSOS = async (req, res) => {
  const { user_id } = req.params
  try {
    const user_response = await SOSSchema.findOne({
      owner_id: user_id,
      status: { $ne: 'resolved' },
    }).lean()
    res.send(user_response !== null ? true : false)
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const GetAcceptedUserDetails = async (req, res) => {
  const { sos_id } = req.params
  try {
    const sos_response = await SOSSchema.findById(sos_id).lean()
    const sos_accepted_detail = await UserSchema.find({
      _id: { $in: sos_response.accepted_list },
    }).lean()
    res.send(sos_accepted_detail.reverse())
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const UpdateAcceptedUserList = async (req, res) => {
  const { sos_id, user_id } = req.body
  try {
    const sos_response = await SOSSchema.findById(sos_id).lean()
    if (sos_response.accepted_list.includes(user_id)) return res.end()
    await SOSSchema.findByIdAndUpdate(sos_id, {
      $push: {
        accepted_list: user_id,
      },
      $set: {
        status: 'accepted',
      },
    })
    res.end()
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const GetSOSDetails = async (req, res) => {
  const { user_id } = req.params
  try {
    const response = await SOSSchema.aggregate([
      {
        $match: {
          user_ids: { $in: [user_id] },
          status: { $ne: 'resolved' },
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
    res.send(response)
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

module.exports = {
  GetMarkers,
  SOSAcceptedCount,
  IsSOS,
  GetAcceptedUserDetails,
  UpdateAcceptedUserList,
  GetSOSDetails,
}
