const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)

connectDB()
  .then(() => {
    console.log("DB conncetd successfully");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch((err) => console.log("failed to connect", err));
