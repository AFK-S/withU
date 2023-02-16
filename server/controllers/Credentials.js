const { validationResult } = require("express-validator");
const User = require("../models/User");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ type: "error", message: errors.array()[0].msg });
  }
  const {
    name,
    email_address,
    phone_number,
    gender,
    emergency_contact,
    password,
  } = req.body;
  try {
    const response = await User.create({
      name,
      email_address,
      phone_number,
      gender,
      emergency_contact,
      password,
    });
    return res.json({
      user_id: response._id,
      name: response.name,
      phone_number: response.phone_number,
      gender: response.gender,
      emergency_contact: response.emergency_contact,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ type: "error", message: errors.array()[0].msg });
  }
  const { email_address, password } = req.body;
  try {
    const response = await User.findOne({
      email_address,
      password,
    }).lean();
    if (response === null) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Credentials" });
    }
    return res.json({
      user_id: response._id,
      name: response.name,
      phone_number: response.phone_number,
      gender: response.gender,
      emergency_contact: response.emergency_contact,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

module.exports = {
  Register,
  Login,
};
