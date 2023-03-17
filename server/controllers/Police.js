const { validationResult } = require("express-validator");
const Police = require("../models/Police");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ type: "error", message: errors.array()[0].msg });
  }
  const { name, branch_name, coordinates, password } = req.body;
  try {
    const response = await Police.create({
      name,
      branch_name,
      coordinates,
      password,
    });
    res.cookie("user_id", response._id).json({
      type: "success",
      message: "Successfully Registered",
    });
    res.send(response._id);
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
  const { name, password } = req.body;
  try {
    const response = await Police.findOne({
      name,
      password,
    }).lean();
    if (response === null) {
      return res
        .status(400)
        .json({ type: "error", message: "Invalid Credentials" });
    }
    res.send(response._id);
  } catch (err) {
    console.error(err);
    res.status(400).json({ type: "error", message: err });
  }
};

module.exports = {
  Register,
  Login,
};
