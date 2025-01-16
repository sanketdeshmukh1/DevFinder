const User = require("../models/user");
const jwt=require("jsonwebtoken")

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedcookie = await jwt.verify(token, "namaste");
    const { _id } = decodedcookie;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user=user
    next()
  } catch (err) {
    res.json("error in auth" + err);
  }
};
module.exports = { authUser };
