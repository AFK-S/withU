const AdministratorSchema = require('../models/Administrator')
const { validationResult } = require('express-validator')
const { METER_RADIUS } = require('../config')
const SOSSchema = require('../models/SOS')
const geolib = require('geolib')

const Register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg)
  }
  const { name, branch_name, type_of_user, coordinates, password } = req.body
  try {
    const response = await AdministratorSchema.create({
      name,
      branch_name,
      type_of_user,
      coordinates,
      password,
    })
    res.json({
      user_id: response._id,
      type_of_user: response.type_of_user,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const Login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()[0].msg)
  }
  const { name, password } = req.body
  try {
    const response = await AdministratorSchema.findOne({
      branch_name: name,
      password,
    }).lean()
    if (response === null) {
      return res.status(400).send('Invalid Credentials')
    }
    res.json({
      user_id: response._id,
      type_of_user: response.type_of_user,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const GetPoliceSOSDetails = async (req, res) => {
  const { user_id } = req.params
  try {
    const officer_response = await AdministratorSchema.findById(user_id).lean()
    const sos_response = await SOSSchema.find({
      status: { $in: ['pending', 'accepted'] },
      description: { $in: ['general', 'accident'] },
    }).lean()
    const sos_ids = sos_response.map((sos) => {
      const distance = geolib.getDistance(
        officer_response.coordinates,
        sos.coordinates,
      )
      if (distance <= METER_RADIUS) return sos._id
    })
    const sos_details = await SOSSchema.aggregate([
      {
        $match: {
          _id: { $in: sos_ids },
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
    res.send(sos_details.reverse())
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const GetHospitalSOSDetails = async (req, res) => {
  const { user_id } = req.params
  try {
    const officer_response = await AdministratorSchema.findById(user_id).lean()
    const sos_response = await SOSSchema.find({
      status: { $in: ['pending', 'accepted'] },
    }).lean()
    const sos_ids = sos_response.map((sos) => {
      const distance = geolib.getDistance(
        officer_response.coordinates,
        sos.coordinates,
      )
      if (distance <= METER_RADIUS) return sos._id
    })
    const sos_details = await SOSSchema.aggregate([
      {
        $match: {
          _id: { $in: sos_ids },
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
    res.send(sos_details.reverse())
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

module.exports = {
  Register,
  Login,
  GetPoliceSOSDetails,
  GetHospitalSOSDetails,
}
