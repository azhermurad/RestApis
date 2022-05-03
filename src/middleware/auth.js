const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const auth = async (req, res, next) => {
  console.log("middleware is working!");

  const token = req.header("Authorization")?.split(" ")[1];

  try {
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, "myscreatekey");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: "unAuthorize user" });
  }
};

module.exports = auth;
