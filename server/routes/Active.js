const express = require("express");
const {
  GetAllActiveLocation,
  GetMeterActiveLocation,
  GetUserLocation,
} = require("../controllers/Active");

const router = express.Router();

router.get("/active/location", GetAllActiveLocation);
router.get("/active/location/meter/:user_id", GetMeterActiveLocation);
router.get("/active/location/:user_id", GetUserLocation);

module.exports = router;
