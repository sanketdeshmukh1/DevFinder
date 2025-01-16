const express = require("express");
const { authUser } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const app = express();
const connectionRouter = express.Router();

connectionRouter.post(
  "/request/:status/:userId",
  authUser,
  async (req, res, next) => {
    try {
      const fromId = req.user._id;
      const toId = req.params.userId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("request connection status is incorrect");
      }
      const toUser = await User.findById(toId);
      if (!toUser) {
        throw new Error("This user is not exist in our database");
      }
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromId, toId },
          { fromId: toId, toId: fromId },
        ],
      });
      if (existingRequest) {
        throw new Error("Connection request is already exist");
      }
      const connection = new ConnectionRequest({ fromId, toId, status });
      const data = await connection.save();
      res.json({
        message: `${req.user.name} is ${status} in ${toUser.name}`,
        data,
      });
    } catch (err) {
      res.send("error occured in connection" + err);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type -" + status);
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        status:"interested",
        toId:loggedInUser._id
      });
      if (!connectionRequest) {
        throw new Error("Invalid connection request");
      }
      connectionRequest.status = status;
      const data=await connectionRequest.save();
      res.json({
        message:`connection request is ${status}`,
        data
      })
    } catch (err) {
      res.send("Something went wrong while reviving request " + err);
    }
  }
);

module.exports = connectionRouter;
