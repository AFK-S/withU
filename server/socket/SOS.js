const fs = require("fs");
const { NearbyUsers, FamilyMembers } = require("../functions");

const SOS = (socket) => {
  socket.on("SOS_button", async (user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    sos_user[user_id] = {
      user_id: user_id,
      isAccepted: false,
    };
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    const nearby_users_socket_ids = await NearbyUsers(user_id);
    if (nearby_users_socket_ids) {
      socket
        .to(nearby_users_socket_ids)
        .emit("SOS_Nearby_Users", `SOS from ${user_id}`);
    }
    const { family_members_socket_ids, family_members } = await FamilyMembers(
      user_id
    );
    if (family_members_socket_ids) {
      socket
        .to(family_members_socket_ids)
        .emit("SOS_Family_Members", `SOS from ${user_id}`);
    }
    console.log("SOS button pressed and sent to nearby users");
  });
  socket.on("SOS_Cancel", async (user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    if (sos_user[user_id]) {
      delete sos_user[user_id];
      fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    }
    // const nearby_users_socket_ids = await NearbyUsers();
    // if (nearby_users_socket_ids) {
    //   socket.to(nearby_users_socket_ids).emit("SOS_Cancelled");
    // }
    const { family_members_socket_ids, family_members } = await FamilyMembers(
      user_id
    );
    if (family_members_socket_ids) {
      socket.to(family_members_socket_ids).emit("SOS_Cancelled");
    }
    console.log("SOS Cancelled");
  });
  socket.on("SOS_Accepted", async (user_id) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    sos_user[user_id] = {
      user_id: sos_user[user_id].user_id,
      isAccepted: true,
    };
    fs.writeFileSync("./json/isSOS.json", JSON.stringify(sos_user));
    const { family_members_socket_ids, family_members } = await FamilyMembers(
      user_id
    );
    if (family_members_socket_ids) {
      socket.to(family_members_socket_ids).emit("SOS_Accepted");
    }
    console.log("SOS Accepted");
  });
  socket.on("SOS_details", async (user_id, callback) => {
    const sos_user = await JSON.parse(fs.readFileSync("./json/isSOS.json"));
    callback(sos_user[user_id]);
  });
};

module.exports = SOS;
