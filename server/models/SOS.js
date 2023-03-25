const { Schema, connection } = require("mongoose");

const SOS = new Schema(
  {
    owner_id: {
      type: String,
      required: [true, "Please add a User ID"],
    },
    status: {
      type: String,
      trim: true,
      enum: ["pending", "accepted", "resolved"],
      match: [
        /^(pending|accepted|resolved)$/,
        (props) => `${props.value} is not a valid sos status`,
      ],
      default: "pending",
      required: [true, "Please add a SOS Status"],
    },
    coordinates: {
      type: Object,
      required: [true, "Please add a Coordinates"],
    },
    accepted_commity_list: {
      type: Array,
      default: [],
    },
    accepted_officials_list: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = connection.useDb("WithU").model("SOS", SOS);
