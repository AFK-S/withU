const { Schema, connection } = require('mongoose')

const StorySchema = new Schema(
  {
    author_id: {
      type: String,
      required: [true, 'Please add a Author ID'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a Title'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please add a Description'],
    },
  },
  {
    timestamps: true,
  },
)

module.exports = connection.useDb('WithU').model('Story', StorySchema)
