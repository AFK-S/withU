const fs = require("fs");
const geolib = require("geolib");
const User = require("../models/User");

const NearbyUsers = async () => {
  const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
  const closest_users = Object.values(users)
    .map((user) => {
      const distance = geolib.getDistance(
        users[id].coordinates,
        user.coordinates
      );
      if (distance / 1000 <= 50) {
        return {
          socket_id: user.socket_id,
          user_id: user.user_id,
          coordinates: user.coordinates,
          distance: distance,
        };
      }
    })
    .sort((a, b) => a.distance - b.distance);
  const socket_ids = closest_users.map((user) => user.socket_id);
  return socket_ids.slice(1);
};

const FamilyMembers = async (user_id) => {
  const user_response = await User.findOne({ _id: user_id });
  const family_members = await User.find({
    phone_number: user_response.emergency_contact,
  });
  const family_members_user_ids = family_members.map((user) => user._id);
  const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
  const family_members_socket_ids = family_members_user_ids.map((user_id) => {
    if (users[user_id]) {
      return users[user_id].socket_id;
    }
  });
  return { family_members_socket_ids, family_members };
};

module.exports = { NearbyUsers, FamilyMembers };
