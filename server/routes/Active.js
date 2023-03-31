const express = require("express");
const router = express.Router();
const fs = require("fs");
const geolib = require("geolib");
const { METER_RADIUS } = require("../config");

router.get("/active/location", async (req, res) => {
  try {
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    res.send(Object.values(users));
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/active/location/meter", async (req, res) => {
  try {
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    const closest_users = Object.values(users)
      .map((user) => {
        const distance = geolib.getDistance(
          users[socket.user_id].coordinates,
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
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/active/location/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const users = await JSON.parse(fs.readFileSync("./json/isActive.json"));
    if (!users[user_id]) return res.status(400).send("User not found");
    res.send(users[user_id].coordinates);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
