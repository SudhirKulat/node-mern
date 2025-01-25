const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const myRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      requestStatus: "INTERESTED",
    }).populate("fromUserId", ["firstName", "lastName", "photoURL", "skills"]);

    if (!myRequests.length) {
      return res.json({ message: "No new request found!" });
    }
    const filteredData = myRequests?.map((row) => row.fromUserId);
    res.json({ data: filteredData });
  } catch (error) {
    res.send("Errro" + error);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const myConnections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, requestStatus: "ACCEPTED" },
        { toUserId: loggedInUser._id, requestStatus: "ACCEPTED" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName", "photoURL", "skills"])
      .populate("toUserId", ["firstName", "lastName", "photoURL", "skills"]);

    if (!myConnections.length) {
      return res.json({ message: "No new request found!" });
    }
    const filteredData = myConnections?.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({ data: filteredData });
  } catch (error) {
    res.send("Errro" + error);
  }
});
module.exports = userRouter;
