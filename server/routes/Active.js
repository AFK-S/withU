const express = require("express");
const router = express.Router();
const fs = require("fs");

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
