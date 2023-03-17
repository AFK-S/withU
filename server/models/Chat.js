const { Schema, connection } = require('mongoose')

const Chat = new Schema(
  {
    sos_id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = connection.useDb('WithU').model('CHAT', Chat)
