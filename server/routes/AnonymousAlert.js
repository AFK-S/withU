const { body } = require("express-validator");
const {
  CreateAnonymousAlert,
  GetAllAnonymousAlert,
} = require("../controllers/AnonymousAlert");
const express = require("express");

const router = express.Router();

router.post(
  "/register/anonymous_alert",
  body("type").not().isEmpty().withMessage("Type is required"),
  body("description").not().isEmpty().withMessage("Description is required"),
  CreateAnonymousAlert
);
router.get("/anonymous_alert", GetAllAnonymousAlert);

module.exports = router;
