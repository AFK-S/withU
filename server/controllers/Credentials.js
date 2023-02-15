const User = require("../models/User");
const { validationResult } = require("express-validator");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ type: "error", message: errors.array()[0].msg });
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
    return res.json(response._id);
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
    return res.json(response._id);
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

module.exports = {
  Register,
  Login,
};
