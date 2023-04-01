const express = require("express");
const router = express.Router();
const geolib = require("geolib");
const { METER_RADIUS } = require("../config");
const PoliceSchema = require("../models/Police");
const SOSSchema = require("../models/SOS");

router.get("/police/sos/:user_id", async (req, res) => {
  const { user_id } = req.query;
  try {
    const officer_response = await PoliceSchema.findById(user_id);
    const sos_response = await SOSSchema.find({
      status: { $in: ["pending", "accepted"] },
      description: { $ne: "medical" },
    }).lean();
    const sos_ids = sos_response.map((sos) => {
      const distance = geolib.getDistance(
        officer_response.coordinates,
        sos.coordinates
      );
      if (distance <= METER_RADIUS) return sos._id;
    });
    const sos_details = await SOSSchema.aggregate([
      {
        $match: {
          _id: { $in: sos_ids },
        },
      },
      {
        $addFields: {
          owner_id: {
            $toObjectId: "$owner_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    res.send(sos_details);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
