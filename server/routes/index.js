const express = require("express");
const router = express.Router();
const PoliceSchema = require("../models/Police");
const SOSSchema = require("../models/SOS");

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
