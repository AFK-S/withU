const { body } = require("express-validator");
const {
  Register,
  Login,
  GetUserDetails,
  UpdateUserDetails,
} = require("../controllers/User");
const express = require("express");

const router = express.Router();

router.post(
  "/register",
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email_address")
    .not()
    .isEmpty()
    .withMessage("Email Address is required")
    .isEmail()
    .withMessage("Invalid Email Address"),
  body("phone_number").not().isEmpty().withMessage("Phone Number is required"),
  body("gender").not().isEmpty().withMessage("Gender is required"),
  body("emergency_contact")
    .not()
    .isEmpty()
    .withMessage("Emergency Contact is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  Register
);
router.put(
  "/login",
  body("email_address")
    .not()
    .isEmpty()
    .withMessage("Email Address is required")
    .isEmail()
    .withMessage("Invalid Email Address"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  Login
);
router.get("/user/:user_id", GetUserDetails);
router.put("/user/:user_id", UpdateUserDetails);

module.exports = router;
