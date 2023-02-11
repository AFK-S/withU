const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

router.post(
  "/register",
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email_address").isEmail().withMessage("Invalid Email Address"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6 and 12 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ type: "error", message: errors.array() });
    }
    const { name, email_address, password } = req.body;
    try {
      const response = await User.create({
        name,
        email_address,
        password,
      });
      return res.json(response);
    } catch (err) {
      console.error(err);
      res.status(400).json({ type: "error", message: err });
    }
  }
);

router.put(
  "/login",
  body("email_address").isEmail(),
  body("password").isLength({ min: 6, max: 12 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ type: "error", message: errors.array() });
    }
    const { email_address, password } = req.body;
    try {
      const response = await User.findOne({
        email_address,
        password,
      });
      if (response === null) {
        return res
          .status(400)
          .json({ type: "error", message: "Invalid Credentials" });
      }
      return res.json(response);
    } catch (err) {
      console.error(err);
      res.status(400).json({ type: "error", message: err });
    }
  }
);

module.exports = router;
