const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
  fromId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"user"  //reference to user table
  },
  toId: {
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"user"
  },
  status: {
    type: String,
    required:true,
    enum: {
      values: ["ignored", "interested", "accepted", "rejected"],
      message: `{VALUE} is incoorect status type`,
    },
  },
},
{timestamps:true}
);

connectionRequestSchema.index({fromId:1,toId:-1})

connectionRequestSchema.pre("save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromId.equals(connectionRequest.toId)){
        throw new Error("You cannot send request to urself")
    }
    next()
})

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports=ConnectionRequest
