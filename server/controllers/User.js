const { validationResult } = require('express-validator')
const UserSchema = require('../models/User')

const Register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg)
  }
  const {
    name,
    email_address,
    phone_number,
    gender,
    emergency_contact,
    password,
  } = req.body
  try {
    const response = await UserSchema.create({
      name,
      email_address,
      phone_number,
      gender,
      emergency_contact,
      password,
    })
    return res.json({
      user_id: response._id,
      emergency_contact: response.emergency_contact,
      password: response.password,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const Login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg)
  }
  const { email_address, password } = req.body
  try {
    const response = await UserSchema.findOne({
      email_address,
      password,
    }).lean()
    if (response === null) {
      return res.status(400).send('Invalid Credentials')
    }
    return res.json({
      user_id: response._id,
      emergency_contact: response.emergency_contact,
      password: response.password,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const GetUserDetails = async (req, res) => {
  const { user_id } = req.params
  try {
    const user_detail = await UserSchema.findById(user_id).lean()
    res.send(user_detail)
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

const UpdateUserDetails = async (req, res) => {
  const { user_id } = req.params
  const { name, emergency_contact } = req.body
  try {
    await UserSchema.findByIdAndUpdate(user_id, {
      name,
      emergency_contact,
    })
    res.send()
  } catch (err) {
    console.log(err)
    res.status(400).send(err.message)
  }
}

module.exports = {
  Register,
  Login,
  GetUserDetails,
  UpdateUserDetails,
}
