const fs = require("fs");
const { NearbyUsers, FamilyMembers } = require("../functions");
const UserSchema = require("../models/User");
const SOSSchema = require("../models/SOS");
const PoliceSchema = require("../models/Police");

const SOS = (io, socket) => {
  socket.on("Is_SOS", async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    callback(sos_user[socket.user_id] ? true : false);
  });
  socket.on("On_SOS", async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    if (!socket.user_id) {
      return callback({
        err: true,
        msg: "User not found",
      });
    }
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    const user_response = await UserSchema.findById(socket.user_id).lean();
    if (user_response === null) {
      return callback({
        err: true,
        msg: "User not found",
      });
    }
    const nearby_users = await NearbyUsers(socket);
    const family_members = await FamilyMembers(socket, callback);
    const SOS_response = await SOSSchema.create({
      owner_id: socket.user_id,
      coordinates: users[socket.user_id].coordinates,
    });
    sos_user[socket.user_id] = {
      sos_id: SOS_response._id,
      user_ids: [...new Set([...nearby_users[0], ...family_members[0]])],
    };
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    const user_detail = {
      user_id: SOS_response.owner_id,
      name: user_response.name,
      coordinates: SOS_response.coordinates,
      time: SOS_response.createdAt,
    };
    if (nearby_users[1] && family_members[1]) {
      socket
        .to([...new Set([...nearby_users[1], ...family_members[1]])])
        .emit("Send_Notification", user_detail);
    }
    io.emit("Refetch_SOS_Details");
    callback(user_detail);
  });
  socket.on("SOS_Cancel", async (callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    if (!sos_user[socket.user_id]) {
      return callback({
        err: true,
        msg: "You are not in SOS",
      });
    }
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: socket.user_id,
      },
      {
        status: "resolved",
      }
    );
    if (sos_user[socket.user_id]) {
      delete sos_user[socket.user_id];
      fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    }
    const user_response = await UserSchema.findById(socket.user_id).lean();
    io.emit("Refetch_SOS_Details");
    callback(user_response.name);
  });
  socket.on("SOS_Accepted_Commity", async (sos_user_id) => {
    const sos_response = await SOSSchema.findOne({
      owner_id: sos_user_id,
      accepted_commity_list: { $in: socket.user_id },
    }).lean();
    if (sos_response !== null) {
      return;
    }
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: sos_user_id,
        status: "pending",
      },
      {
        $push: {
          accepted_commity_list: socket.user_id,
        },
      }
    );
    await SOSSchema.findOneAndUpdate(
      {
        owner_id: sos_user_id,
        status: "pending",
      },
      {
        status: "accepted",
      }
    );

    io.emit("Refetch_SOS_Details");
  });
  socket.on("Get_SOS_details", async () => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    const sos_details_list = Object.values(sos_user).filter((user) => {
      return user.user_ids.includes(socket.user_id);
    });
    const sos_ids = sos_details_list.map((sos) => {
      return sos.sos_id;
    });
    const sos_response = await SOSSchema.aggregate([
      {
        $addFields: {
          id: {
            $toString: "$_id",
          },
        },
      },
      {
        $match: {
          id: { $in: sos_ids },
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
    socket.emit("Pass_SOS_Details", sos_response);
  });
  socket.on("Get_SOS_Accepted_List", async (sos_owner_id, callback) => {
    const sos_response = await SOSSchema.findOne({
      owner_id: sos_owner_id,
    }).lean();
    const sos_accepted_detail = await UserSchema.find({
      _id: { $in: sos_response.accepted_commity_list },
    }).lean();
    const sos_accepted_officials_detail = await PoliceSchema.find({
      _id: { $in: sos_response.accepted_officials_list },
    }).lean();
    callback(sos_accepted_detail, sos_accepted_officials_detail);
  });
  socket.on("Get_SOS", async (callback) => {
    const sos_response = await SOSSchema.find({
      status: "resolved",
    }).lean();
    callback(sos_response);
  });
};

module.exports = SOS;
