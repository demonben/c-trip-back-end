const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).send("User not found with this email");
      return;
    }
    bcrypt.compare(password, user.passwordHash, (err, result) => {
      if (err) next(err);
      else {
        if (result) {
          const token = jwt.sign({ id: user._id }, "secret");
          res.send({ token: token, user: user });
        } else {
          res.status(401).send("Incorrect password"); // 401: unauthorized
        }
      }
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
