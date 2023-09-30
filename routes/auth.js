const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup");
});

module.exports = router;
