const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const { MONGOURI } = require("./config/keys");
//config Express App
// app.use(express.bodyParser());
// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

//config PORT
app.use(express.json());
app.use(cors());
//config MongoDB
mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.once("open", () => console.log("MongoDB connection has been established!"));

mongoose.connection.on("connected", () => {
  console.log("conneted to mongo yeahh");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

//config routes
const addressRouter = require("./routes/address");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/auth");

app.use("/user", userRouter);
app.use("/auth", authRouter);

// // To differentiate backend posts route, I am adding server/
app.use("/address", addressRouter);

//Load the npm build package of the frontend CRA
if (process.env.NODE_ENV === "production") {
  // set a static folder
  app.use(express.static("client/build"));

  // Provide a wildcard as a fallback for all routes
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

//Host app at PORT
app.listen(PORT, () => console.log(`Server is running at PORT ${PORT}!`));
