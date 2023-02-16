const fs = require("fs");
const geolib = require("geolib");

const NearbyUsers = async (user_id) => {
  const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
  const closest_users = Object.values(users)
    .map((user) => {
      const distance = geolib.getDistance(
        users[user_id].coordinates,
        user.coordinates
      );
      if (distance / 1000 <= 5) {
        return {
          socket_id: user.socket_id,
          user_id: user.user_id,
          coordinates: user.coordinates,
          distance: distance,
        };
      }
    })
    .sort((a, b) => a.distance - b.distance);
  const socket_ids = closest_users.map((user) => {
    if (user) {
      return user.socket_id;
    }
  });
  return socket_ids.slice(1);
};

const FamilyMembers = async (emergency_contact) => {
  const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
  const family_members_socket_ids = Object.values(users).map((user) => {
    if (emergency_contact.includes(user.phone_number)) {
      return user.socket_id;
    }
  });
  return family_members_socket_ids;
};

module.exports = { NearbyUsers, FamilyMembers };
