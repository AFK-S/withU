const fs = require("fs");
const { NearbyUsers, FamilyMembers } = require("../functions");

const SOS = (socket) => {
  socket.on("SOS_button", async (user_id, emergency_contact, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    const nearby_users = await NearbyUsers(user_id);
    const family_members = await FamilyMembers(emergency_contact);
    sos_user[user_id] = {
      user_id: user_id,
      name: users[user_id].name,
      phone_number: users[user_id].phone_number,
      user_ids: [...nearby_users[0], ...family_members[0]],
      time: Date.now(),
    };
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    const user_details = {
      user_id: user_id,
      name: sos_user[user_id].name,
      coordinates: users[user_id].coordinates,
      phone_number: sos_user[user_id].phone_number,
      time: sos_user[user_id].time,
    };
    if (nearby_users[1] && family_members[1]) {
      socket
        .to([...nearby_users[1], ...family_members[1]])
        .emit("SOS_Send", user_details);
    }
    callback(user_details);
  });
  socket.on("SOS_Cancel", async (user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    if (sos_user[user_id]) {
      delete sos_user[user_id];
      fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    }
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    const user_details = {
      user_id: user_id,
      name: users[user_id].name,
    };
    callback(user_details);
  });
  socket.on("SOS_Accepted", async (user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    for (const sos in Object.keys(sos_user)) {
      if (sos.user_ids.includes(user_id)) {
        sos_user[sos.user_id].accepted_list = [
          ...sos_user[sos.user_id].accepted_list,
          {
            user_id: user_id,
            name: users[user_id].name,
            phone_number: users[user_id].phone_number,
          },
        ];
      }
    }
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
  });
  socket.on("Get_SOS_details", async (user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    const details = Object.values(sos_user).map((user) => {
      if (user.user_ids.includes(user_id)) {
        return {
          ...user,
          coordinates: users[user.user_id].coordinates,
        };
      }
    });
    callback(details);
  });
  socket.on("Get_SOS_detail", async (sos_user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    sos_user[sos_user_id].accepted_list = sos_user[
      sos_user_id
    ].accepted_list.map((user) => {
      if (user) {
        return {
          ...user,
          coordinates: users[user.user_id].coordinates,
        };
      }
    });
    callback(sos_user[sos_user_id]);
  });
};

module.exports = SOS;
