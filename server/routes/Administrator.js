const {
  Register,
  Login,
  GetPoliceSOSDetails,
  GetHospitalSOSDetails,
} = require("../controllers/Administrator");
const { body } = require("express-validator");
const express = require("express");

const router = express.Router();

router.post(
  "/police/register",
  body("name").not().isEmpty().withMessage("Name is required"),
  body("branch_name").not().isEmpty().withMessage("Branch Name is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  Register
);

router.put(
  "/police/login",
  body("name").not().isEmpty().withMessage("Name is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  Login
);
router.get("/police/sos/:user_id", GetPoliceSOSDetails);
router.get("/hospital/sos/:user_id", GetHospitalSOSDetails);

module.exports = router;
