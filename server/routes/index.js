const express = require("express");
const router = express.Router();
const PoliceSchema = require("../models/Police");
const SOSSchema = require("../models/SOS");
const UserSchema = require("../models/User");

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_detail = await UserSchema.findById(user_id).lean();
    res.send(user_detail);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.put("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { name, emergency_contact } = req.body;
  try {
    await UserSchema.findByIdAndUpdate(user_id, {
      name,
      emergency_contact,
    });
    res.send();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/police_sos", async (req, res) => {
  try {
    const police_response = await PoliceSchema.find().lean();
    const sos_response = await SOSSchema.find({
      status: "resolved",
    }).lean();
    res.json({
      police_response,
      sos_response,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
