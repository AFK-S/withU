const { body } = require("express-validator");
const {
  CreateStory,
  GetMyStory,
  GetAllStory,
  DeleteStory,
} = require("../controllers/Story");
const express = require("express");

const router = express.Router();

router.post(
  "/register/story",
  body("user_id").not().isEmpty().withMessage("User ID is required"),
  body("title").not().isEmpty().withMessage("Title is required"),
  body("description").not().isEmpty().withMessage("Description is required"),
  CreateStory
);
router.get("/story/:user_id", GetMyStory);
router.get("/story", GetAllStory);
router.delete("/story/:story_id", DeleteStory);

module.exports = router;
