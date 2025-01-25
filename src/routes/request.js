const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post(
  "/request/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params?.userId;
      const status = req.params?.status.toUpperCase();
      let statusMessage = "";
      const ALLOWED_REQUESTS = ["INTERESTED", "IGNORE"];
      if (!ALLOWED_REQUESTS.includes(status)) {
        throw new Error("Invalid request type");
      }

      const isActiveReciver = await User.findById(toUserId);

      if (!isActiveReciver) {
        return res.status(400).json({ message: "Invalid Request" });
      }

      if (status == "INTERESTED") {
        statusMessage = `${req.user.firstName} has sent interested request to ${isActiveReciver?.firstName}`;
      } else if (status == "IGNORE") {
        statusMessage = `${req.user.firstName} you have successfully ignored ${isActiveReciver?.firstName}`;
      }
      const isExistingConnectionReq = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isExistingConnectionReq) {
        throw new Error("Connection request already present!!");
      }
      const connectionReq = new ConnectionRequest({
        fromUserId,
        toUserId,
        requestStatus: status,
      });

      const request = await connectionReq.save();
      res.json({
        message: statusMessage,
        data: {
          data: request,
        },
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:connectionReqId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params?.status.toUpperCase();
      const requestId=  req.params?.connectionReqId;
      let statusMessage = "";
      const ALLOWED_REQUESTS = ["ACCEPTED", "REJECTED"];
      if (!ALLOWED_REQUESTS.includes(status)) {
        throw new Error("Invalid request type");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        requestStatus: "INTERESTED"
      });

      if (!connectionRequest) {
        return res.status(400).json({ message: "Connection request not found" });
      }

      if (status == "ACCEPTED") {
        statusMessage = `Request accepted succesfully.`;
      } else if (status == "REJECTED") {
        statusMessage = `Request has rejected succesfully`;
      }
      
      connectionRequest.requestStatus = status;
      const data = await connectionRequest.save();
      res.json({
        message: statusMessage,
        data: {
          data: data,
        },
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

module.exports = connectionRouter;
