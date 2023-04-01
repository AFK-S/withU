const { validationResult } = require("express-validator");
const Police = require("../models/Police");

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array()[0].msg);
  }
  const { name, branch_name, type_of_user, coordinates, password } = req.body;
  try {
    const response = await Police.create({
      name,
      branch_name,
      type_of_user,
      coordinates,
      password,
    });
    res.json({
      user_id: response._id,
      type_of_user: response.type_of_user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array()[0].msg);
  }
  const { name, password } = req.body;
  try {
    const response = await Police.findOne({
      name,
      password,
    }).lean();
    if (response === null) {
      return res.status(400).send("Invalid Credentials");
    }
    res.json({
      user_id: response._id,
      type_of_user: response.type_of_user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

module.exports = {
  Register,
  Login,
};
