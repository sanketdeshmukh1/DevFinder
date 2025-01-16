const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("./auth");
const { dbConnect } = require("./db");
const { validateSignInUser } = require("./Utils/validateSignIn");
const User = require("./models/user");
const app = express();
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { authUser } = require("./Middleware/auth");
const {authRouter}=require("./Routes/auth")
const {profileRouter}=require("./Routes/profile")
const connectionRouter=require("./Routes/request");
const UserRouter = require("./Routes/User");

app.use(express.json());
app.use(cookieParser());

dbConnect()
  .then(() => {
    console.log("DB is connected");
    app.listen(4000, () => {
      console.log("i am listning on 4000 port");
    });
  })
  .catch((err) => {
    console.log("Error in connecting db", err);
  });

  app.use("/",authRouter)

  app.use("/",profileRouter)

  app.use("/",connectionRouter)

  app.use("/",UserRouter)


//saving user in DB
// app.post("/signUser", async (req, res) => {
//   try {
//     const { name, password, age, city, email, gender } = req.body;
//     validateSignInUser(req.body);
//     const hashPass = await bcrypt.hash(password, 10);

//     const user = new User({
//       name,
//       age,
//       city,
//       email,
//       gender,
//       password: hashPass,
//     });
//     await user.save();
//     res.send("user saved");
//   } catch (e) {
//     res.send("error occured while saving data in db" + e);
//   }
// });


// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!validator.isEmail(email)) {
//       throw new Error("Enter valid email");
//     }
//     const user = await User.findOne({ email });

//     console.log("user");
//     console.log(user);
//     if (!user) {
//       throw new Error("user with this email is not present");
//     }
//     const result = await user.validatePass(password)
//     if (result) {
//       const token = await user.getToken()
//       console.log(token);
//       res.cookie("token", token,{expires: new Date(Date.now() + 24 * 60 * 60 * 1000)});
//       res.send("login successfull");
//     } else {
//       res.send("login failed due to incorrect password");
//     }
//   } catch (err) {
//     res.send("Error occurred" + err);
//   }
// });

//read from the DB


app.get("/user", async (req, res) => {
  try {
    const user = await User.find({});
    // const user=await User.findOne({}) //find one does not gurantee which it will return
    // const city = req.body.city;
    // const user = await User.find({ city });
    res.send(user);
    console.log(user);
  } catch (err) {
    console.log("err while find operation");
  }
});

// app.get("/profile", authUser, async (req, res) => {
//   try {
//     res.json(req.user);
//   } catch (err) {
//     res.json("error in profile" + err);
//   }
// });

app.post("/sendConnection",authUser,async(req,res)=>{
  try {
    res.json("connection sent by "+req.user.name);
  } catch (err) {
    res.json("error in profile" + err);
  }

})

//delete from DB
app.delete("/deleteUser", async (req, res) => {
  try {
    const city = req.body.city;

    //const deletedDoc =await User.findByIdAndDelete(id)
    const deletedDoc = await User.findOneAndDelete({ city });
    //const deleteCount=await User.deleteOne({city}) //deleteone and deletemany does not return delted doc
    //const deleteCount=await User.deleteMany({city})
    console.log("delete operation succfull");
    res.send(deletedDoc);
  } catch (err) {
    console.log("error in delete operation");
    res.send("delete operation succfull");
  }
});

app.patch("/updateUser", async (req, res) => {
  const city = req.body.city;
  const data = req.body;
  const updateAllowed = ["city", "about", "skills"];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      updateAllowed.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("cannot update age");
    }
    //    const updateCount = await User.updateOne({ city}, data);
    //    const updateCount = await User.updateMany({ city}, data);
    // const afterUpdateRes = await User.findOneAndUpdate({ city }, data, {
    //   returnDocument: "after",
    // });
    const beforeUpdateRes = await User.findOneAndUpdate({ city }, data, {
      runValidators: true,
    }); //bedef it return beforeupdatedoc
    //By default, Mongoose does not run schema validation when performing an update.
    //The option runValidators: true ensures that Mongoose runs the validators defined in the schema for the fields being updated.

    console.log("update operation successfull");
    res.send(beforeUpdateRes);
  } catch (err) {
    console.log("error in update operation");
    res.send("update operation faild" + err);
  }
});
