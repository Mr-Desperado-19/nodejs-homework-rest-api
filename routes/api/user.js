const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");

router.get("/current", authMiddleware, (req, res) => {
  res.json({ email: req.user.email, subscription: req.user.subscription });
});

module.exports = router;
