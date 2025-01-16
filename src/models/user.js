const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,   //if we do uniques:true then it automatically add index for name
      min: 2,
      max: 20,
    },
    age: {
      type: Number,
      required: true,
      min: 12,
    },
    city: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 10,
    },
    gender: {
      type: String,
      index:true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("gender is invalid");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          //validator library provide many functions
          throw new Error("error in email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please keep stron password");
        }
      },
    },
    about: {
      type: String,
      default: "i am default about description",
    },
    photoUrl:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("URL is not valid")
            }
        }
    },
    skills: {
      type: [String],
      default: ["nodejs", "Javascript"],
    },
  },
  { timestamps: true }
);
userSchema.methods.getToken = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "namaste", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePass = async function (userInputPassword) {
  const user = this;
  const result = await bcrypt.compare(userInputPassword, user.password);
  return result;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
