const { Schema, connection } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      match: [
        /^[a-zA-Z0-9 ]+$/,
        (props) => `${props.value} is not a valid name`,
      ],
      required: [true, "Please add a Name"],
    },
    email_address: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
        (props) => `${props.value} is not a valid email`,
      ],
      required: [true, "Please add an Email Address"],
      unique: true,
    },
    phone_number: {
      type: String,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        (props) => `${props.value} is not a valid phone number`,
      ],
      required: [true, "Please add a Phone Number"],
      unique: true,
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female"],
      match: [
        /^(male|female)$/,
        (props) => `${props.value} is not a valid gender`,
      ],
      required: [true, "Please add a Gender"],
    },
    emergency_contact: {
      type: Array,
      trim: true,
      match: [
        /^[0-9]{10}$/,
        (props) => `${props.value} is not a valid phone number`,
      ],
      required: [true, "Please add an Emergency Contact"],
    },
    password: {
      type: String,
      required: [true, "Please add a Password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = connection.useDb("WithU").model("USER", UserSchema);
