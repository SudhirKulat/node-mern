const express = require("express");
const { validateSignUpData } = require("../utils/validator");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //validating signup data at API level
    validateSignUpData(req);

    //Encrypting password
    const {
      firstName,
      lastName,
      emailId,
      password: userEnteredPassword,
    } = req.body;
    const encryptedPassword = await bcrypt.hash(userEnteredPassword, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: encryptedPassword,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password: userEnteredPassword } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Please enter correct credentials");
    }
    const isValidPassword = await user.isValidPassword(userEnteredPassword);
    if (isValidPassword) {
      const token = await user.getJwt();
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Please enter correct credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout successful");
});

module.exports = authRouter;
