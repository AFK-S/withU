const AnonymousAlertSchema = require("../models/AnonymousAlert");

const CreateAnonymousAlert = async (req, res) => {
  const { type, description } = req.body;
  try {
    await AnonymousAlertSchema.create({
      type,
      description,
    });
    res.send("Successfully Registered");
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

const GetAllAnonymousAlert = async (req, res) => {
  try {
    const anonymous_alert_response = await AnonymousAlertSchema.find().lean();
    res.send(anonymous_alert_response.reverse());
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
};

module.exports = {
  CreateAnonymousAlert,
  GetAllAnonymousAlert,
};
