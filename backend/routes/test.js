const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/private', auth, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is a protected route.` });
});

module.exports = router;
