const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// for the token
dotenv.config({ path: '../config/config.env' });
//Validation with Joi, for schema validation
const { registerValidation, loginValidation } = require('../validation');

// REGISTER NEW USER
router.post('/register', async (req, res) => {
  // VALIDATE DATA BEFORE MAKING A USER
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //CHECK IF USER ALREADY EXISTS IN DATABASE
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  //HASH THE PASSWORD (first generate salt)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // CREATE NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send(error);
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  // VALIDATE DATA BEFORE LOGGING IN A USER (LOGIN FORM)
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //CHECKING IF USER EXISTS BY LOOKING FOR USER'S EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('This email is not in our system');

  // CHECK IF PASSWORD IS CORRECT BY COMPARING THE USER PASSWORD
  const correctPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!correctPassword)
    return res.status(400).send('Please enter the correct password');

  // CREATE AND ASSIGN A TOKEN (PASS IN SOME INFORMATION, WE WILL USE THE ID) THEN ADD TO HEADER
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
