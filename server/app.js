require("dotenv").config();
require("events").EventEmitter.defaultMaxListeners = 100;
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const express = require("express");
const socket = require("./socket");
const cors = require("cors");
// const test_model = require("./chatbot/test_model");

const port = process.env.PORT || 8000;
const app = express();
const http = require("http").Server(app);

try {
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to database");
} catch (error) {
  console.log(error);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api", require("./routes/Administrator"));
app.use("/api", require("./routes/User"));
app.use("/api", require("./routes/Active"));
app.use("/api", require("./routes/SOS"));
app.use("/api", require("./routes/Story"));
app.use("/api", require("./routes/AnonymousAlert"));
app.get("/api/chatbot/:message", async (req, res) => {
  const { message } = req.params;
  // const response = await test_model(message);
  res.send("hihihihhihihhhihihi");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

socket(http);

http.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
