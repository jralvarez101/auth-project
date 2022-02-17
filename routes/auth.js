const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

//Validation with Joi, for schema validation
const { registerValidation } = require('../validation');

router.post('/register', async (req, res) => {
  // VALIDATE DATA BEFORE MAKING A USER
  const { error } = registerValidation(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //CHECK IF USER ALREADY EXISTS IN DATABASE
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  // CREATE NEW USER
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
