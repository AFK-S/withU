const {
  GetMarkers,
  SOSAcceptedCount,
  IsSOS,
  GetAcceptedUserDetails,
  UpdateAcceptedUserList,
  GetSOSDetails,
} = require("../controllers/SOS");
const express = require("express");

const router = express.Router();

router.get("/administrator_sos", GetMarkers);
router.get("/sos_accepted_count/:user_id", SOSAcceptedCount);
router.get("/is_sos/:user_id", IsSOS);
router.get("/sos/accepted/:sos_id", GetAcceptedUserDetails);
router.post("/sos/accepted", UpdateAcceptedUserList);
router.get("/sos/details/:user_id", GetSOSDetails);

module.exports = router;
