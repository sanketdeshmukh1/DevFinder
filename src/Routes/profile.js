
const express=require("express")
const app=express()
const profileRouter=express.Router()
const { authUser } = require("../Middleware/auth");

const validateEditAllowed=require("../Utils/validateEditAllowed")
profileRouter.get("/profile", authUser, async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.json("error in profile" + err);
  }
});

profileRouter.patch("/profile",authUser,async(req,res)=>{
try{
    const result=validateEditAllowed(req)
if(!result){
    throw new Error("Field is not allowed to update")
}
const loggedInUser=req.user
Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]))
await loggedInUser.save()
res.json("profile updated succesfully")
}
catch (err) {
    console.log("error in update operation");
    res.send("update operation faild" + err);
  }

})

module.exports={profileRouter}
