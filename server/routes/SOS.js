const express = require("express");
const router = express.Router();
const SOSSchema = require("../models/SOS");
const UserSchema = require("../models/User");

router.get("/is_sos/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const user_response = await SOSSchema.findOne({
      owner_id: user_id,
      status: { $ne: "resolved" },
    }).lean();
    res.send(user_response !== null ? true : false);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/sos/accepted/:sos_id", async (req, res) => {
  const { sos_id } = req.params;
  try {
    const sos_response = await SOSSchema.findById(sos_id).lean();
    const sos_accepted_detail = await UserSchema.find({
      _id: { $in: sos_response.accepted_commity_list },
    }).lean();
    res.send(sos_accepted_detail);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/sos/accepted", async (req, res) => {
  const { sos_id, user_id } = req.body;
  try {
    const sos_response = await SOSSchema.findById(sos_id).lean();
    if (sos_response.accepted_commity_list.includes(user_id)) return res.end();
    await SOSSchema.findByIdAndUpdate(sos_id, {
      $push: {
        accepted_commity_list: user_id,
      },
      $set: {
        status: "accepted",
      },
    });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/sos/details/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const response = await SOSSchema.aggregate([
      {
        $match: {
          user_ids: { $in: [user_id] },
          status: { $ne: "resolved" },
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
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
