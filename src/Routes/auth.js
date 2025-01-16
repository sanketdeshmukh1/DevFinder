const express=require("express")
const app=express()
const authRouter=express.Router()
const User = require("../models/user");
const { validateSignInUser } = require("../Utils/validateSignIn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { now } = require("mongoose");


authRouter.post("/signUser", async (req, res) => {
    try {
      const { name, password, age, city, email, gender,photoUrl } = req.body;
      validateSignInUser(req.body);
      const hashPass = await bcrypt.hash(password, 10);
  const result=await User.findOne({email})
  if(result){
    throw new Error("This email id is already registered")
  }
      const user = new User({
        name,
        age,
        city,
        email,
        gender,
        photoUrl,
        password: hashPass,
      });
      await user.save();
      res.send("user saved");
    } catch (e) {
      res.send("error occured while saving data in db" + e);
    }
  });


  authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!validator.isEmail(email)) {
        throw new Error("Enter valid email");
      }
      const user = await User.findOne({ email });
  
      console.log("user");
      console.log(user);
      if (!user) {
        throw new Error("user with this email is not present");
      }
      const result = await user.validatePass(password)
      if (result) {
        const token = await user.getToken()
        console.log(token);
        res.cookie("token", token,{expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
        res.send("login successfull");
      } else {
        res.send("login failed due to incorrect password");
      }
    } catch (err) {
      res.send("Error occurred" + err);
    }
  });

  authRouter.post("/logout", (req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())})    
    res.send("logout successfull");
  })

  module.exports={authRouter}