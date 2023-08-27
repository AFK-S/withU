const StorySchema = require("../models/Story");

const CreateStory = async (req, res) => {
  const { user_id, title, place, description } = req.body;
  try {
    await StorySchema.create({
      author_id: user_id,
      title,
      description,
    });
    res.send("Successfully Registered");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const GetMyStory = async (req, res) => {
  const { user_id } = req.params;
  try {
    const story_response = await StorySchema.aggregate([
      {
        $match: {
          author_id: user_id,
        },
      },
      {
        $addFields: {
          user_id: {
            $toObjectId: "$author_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    res.send(story_response.reverse());
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const GetAllStory = async (req, res) => {
  try {
    const story_response = await StorySchema.aggregate([
      {
        $addFields: {
          user_id: {
            $toObjectId: "$author_id",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);
    res.send(story_response.reverse());
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const DeleteStory = async (req, res) => {
  const { story_id } = req.params;
  try {
    await StorySchema.findByIdAndDelete(story_id);
    res.send("Successfully Deleted");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports = {
  CreateStory,
  GetMyStory,
  GetAllStory,
  DeleteStory,
};
