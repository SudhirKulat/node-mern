const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const PUBLIC_DATA_FIELDS = ["firstName", "lastName", "photoURL", "skills"];

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

userRouter.get("/user/feeds", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    let limit = parseInt(req.query?.limit) || 10;
    const page = parseInt(req.query?.page) || 1;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
    const myConnectionsRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hiddenUsersFromFeed = new Set();
    myConnectionsRequests.forEach((request) => {
      hiddenUsersFromFeed.add(request.fromUserId.toString());
      hiddenUsersFromFeed.add(request.toUserId.toString());
    });
    const usersFeed = await User.find({
      $and: [
        {
          _id: { $nin: Array.from(hiddenUsersFromFeed) },
        },
        {
          _id: { $ne: loggedInUser._id },
        },
      ],
    })
      .select(PUBLIC_DATA_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({ data: usersFeed });
  } catch (error) {
    res.send("Errro" + error);
  }
});

module.exports = userRouter;
