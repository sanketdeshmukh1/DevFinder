const express = require("express");
const { authUser } = require("../Middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const UserRouter = express.Router();

UserRouter.get("/user/requestReceived", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestsReceived = await ConnectionRequest.find({
      toId: loggedInUser._id,
      status: "interested",
    }).populate("fromId", ["name", "age", "city", "email"]);

    res.json({
      message: `Your connection request are `,
      requestsReceived,
    });
  } catch (err) {
    res.status(400).send("Error in viewing Received Request" + err);
  }
});

UserRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections=await ConnectionRequest.find({
      $or:[
        {toId:loggedInUser._id, status:"accepted"},
        {fromId:loggedInUser._id , status:"accepted"}
      ]  
    }).populate("fromId", ["name", "age", "city"]).populate("toId",["name","age","city"])


//jeva loggin in user send karto connection req teva to fromid madhe jato tya case madhe jar apn khalchya 
//3 lines skip kelya tar aplyala swatchch naav disel connection req madhe, tya case madhe aplyala toId 
//madhla user show karaych ahe  so ti case tackle karayla belwo code ahe
    const data=connections.map((row)=>{
        if(row.fromId._id.toString()===loggedInUser._id.toString()){
            return row.toId
        }
        return row.fromId
    })

    if(connections.length==0){
        res.send("sorry you dont have any connection as of now")
    }else{
        res.json({
            message:"Here is your connection list",
            data
        })
    }
  } catch (err) {
    res.status(400).send("Something went wrong in viewing connection" + err);
  }
});

UserRouter.get("/user/feed",authUser,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        let limit=parseInt(req.query.limit)|2;
        limit =limit<50?limit:50
        const skip=(parseInt(req.query.page)-1)*limit
        // user except
        // already connection with you
        // self
        //ignored
        const hideUser=await ConnectionRequest.find({
            $or:[
                {fromId:loggedInUser._id},
                {toId:loggedInUser._id}
            ]
        }).select("fromId toId")
        const userSet=new Set()
        hideUser.forEach((user)=>{
            userSet.add(user.fromId.toString())
            userSet.add(user.toId.toString())
        })
       const data=await User.find({
            $and:[
                {_id:{$nin:Array.from(userSet)}}     ,
                {_id:{$ne:loggedInUser._id}}
            ]
        }).select("name age city").skip(skip).limit(limit)
        console.log(data)
        res.send(data)

    }
    catch(err){
        res.send("error in showing feed"+err)
    }
})

module.exports = UserRouter;
