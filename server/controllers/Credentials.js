const User = require("../models/User");
const { validationResult } = require("express-validator");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ type: "error", message: errors.array() });
  }
  const { name, email_address, password } = req.body;
  try {
    const response = await User.create({
      name,
      email_address,
      password,
    });
    return res.json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ type: "error", message: errors.array() });
  }
  const { email_address, password } = req.body;
  try {
    const response = await User.findOne({
      email_address,
      password,
    });
    if (response === null) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Credentials" });
    }
    return res.json(response);
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

module.exports = {
  Register,
  Login,
};
