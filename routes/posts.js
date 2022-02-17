const express = require('express');
const router = express.Router();

// TO MAKE THIS A PRIVATE ROUTE
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
  res.json({
    title: 'My first post',
    description:
      'random data you should not have access to unless you are logged in',
  });

  //YOU ALSO HAVE ACCESS TO THE ID SINCE WE TIED IT TO THE TOKEN
  //   res.send(req.user);
});

module.exports = router;
