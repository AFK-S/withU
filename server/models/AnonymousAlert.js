const { Schema, connection } = require("mongoose");

const AnonymousAlertSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "harassment",
        "assault",
        "domestic_violence",
        "stalking",
        "hate_crime",
      ],
      match: [
        /^(harassment|assault|domestic_violence|stalking|hate_crime)$/,
        (props) => `${props.value} is not a valid type`,
      ],
      trim: true,
      required: [true, "Please add a Type"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please add a Description"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = connection
  .useDb("WithU")
  .model("AnonymousAlert", AnonymousAlertSchema);
