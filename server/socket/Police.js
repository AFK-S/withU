const SOSSchema = require("../models/SOS");
const PoliceSchema = require("../models/Police");
const { METER_RADIUS } = require("../config");
const geolib = require("geolib");

const SOS = (io, socket) => {
  socket.on("SOS_Accepted_Officials", async (user_id, sos_id) => {
    await SOSSchema.findByIdAndUpdate(sos_id, {
      $push: {
        accepted_officials_list: user_id,
      },
    });
    await SOSSchema.findOneAndUpdate(sos_id, {
      status: "accepted",
    });
    io.emit("Refetch_SOS_Details");
  });
  socket.on("Get_SOS_Officials", async (user_id) => {
    const officer_response = await PoliceSchema.findById(user_id);
    if (officer_response === null) {
      return;
    }
    const sos_response = await SOSSchema.find({
      status: { $in: ["pending", "accepted"] },
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
    socket.emit("Pass_Officials_SOS_Details", sos_details);
  });
  socket.on("Get_Police", async (callback) => {
    const police_response = await PoliceSchema.find().lean();
    callback(police_response);
  });
};

module.exports = SOS;
