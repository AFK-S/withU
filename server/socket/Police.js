const fs = require("fs");
const SOSSchema = require("../models/SOS");
const PoliceSchema = require("../models/Police");
const UserSchema = require("../models/User");
const { METER_RADIUS } = require("../config");
const geolib = require("geolib");

const SOS = (io, socket) => {
  socket.on("SOS_Accepted_Officials", async (user_id, sos_user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    if (!sos_user[sos_user_id].accepted_officials_list) {
      sos_user[sos_user_id].accepted_officials_list = [];
    }
    if (sos_user[sos_user_id].accepted_officials_list.includes(user_id)) {
      return;
    }
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: socket.user_id,
        status: "pending",
      },
      {
        status: "accepted",
      }
    );
    sos_user[sos_user_id].accepted_list = [
      ...sos_user[sos_user_id].accepted_officials_list,
      user_id,
    ];
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
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
    const closest_users_sos_id = sos_response.map((sos) => {
      const distance = geolib.getDistance(
        officer_response.coordinates,
        sos.coordinates
      );
      if (distance / 1000 <= METER_RADIUS) return sos._id;
    });
    const sos_details = await SOSSchema.aggregate([
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $match: {
          id: { $in: closest_users_sos_id },
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
};

module.exports = SOS;
