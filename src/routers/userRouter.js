const express = require("express");
const User = require("../models/user_model");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.jwtToken();
    res.status(201).send({ data: user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.send({ error: "no user found" });
      return;
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res.send({ error: "password is incorrect!" });
      return;
    }
    const token = await user.jwtToken();
    res.send({ data: user, token: token });
  } catch (error) {
    res.send("something went wrong");
  }
});

// read users
router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({}).populate("tasks").exec();
    console.log(users)
    res.status(200).send({ data: users });
  } catch (error) {
    res.status(500).send();
  }
});
// read single users
router.get("/users/me", async (req, res) => {
  try {
    const user = req.user;
    res.send({ data: user });
  } catch (error) {
    res.status(500).send();
  }
});
router.patch("/users/me", auth,async (req, res) => {
  // res.send(req.body)
  try {
    const user = req.user;
    user.name = req.body.name || user.name;
    user.password = req.body.password || user.password;
    await user.save();
    res.send({ data: user });
  } catch (error) {
    res.send({ error: error });
  }
});

router.delete("/users/me", auth ,async (req, res) => {
  const user = req.user;
  try {
    await user.remove();
    res.send({ data: user });
  } catch (error) {
    res.status(500).send({ error: "something went wrong!! Please try again" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const { user, token } = req;
    user.tokens = user.tokens.filter((item) => item.token != token);
    await user.save();
    res.status(200).send({ message: "user is logout" });
  } catch (error) {
    res.status(500).send({ message: "someThing went wrong! Please try again" });
  }
});
module.exports = router;
