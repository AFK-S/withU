const { METER_RADIUS } = require("../config");
const geolib = require("geolib");
const fs = require("fs");

const GetAllActiveLocation = async (req, res) => {
  try {
    const users = await JSON.parse(fs.readFileSync("./cache.json"));
    res.send(Object.values(users));
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const GetMeterActiveLocation = async (req, res) => {
  const { user_id } = req.params;
  try {
    const users = await JSON.parse(fs.readFileSync("./cache.json"));
    const closest_users = Object.values(users)
      .map((user) => {
        const distance = geolib.getDistance(
          users[user_id].coordinates,
          user.coordinates
        );
        if (distance <= METER_RADIUS) {
          return {
            user_id: user.user_id,
            coordinates: user.coordinates,
            distance: distance,
          };
        }
      })
      .sort((a, b) => a.distance - b.distance);
    res.send(closest_users);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const GetUserLocation = async (req, res) => {
  const { user_id } = req.params;
  try {
    const users = await JSON.parse(fs.readFileSync("./cache.json"));
    if (!users[user_id]) return res.status(400).send("User not found");
    res.send(users[user_id].coordinates);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports = {
  GetAllActiveLocation,
  GetMeterActiveLocation,
  GetUserLocation,
};
