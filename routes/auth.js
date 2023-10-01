const passport = require("passport");
const express = require("express");
const router = express.Router();
const ColorHash = require("color-hash").default;
const bcrypt = require("bcryptjs");
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const User = require("../schemas/user");

router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("login");
});

router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("signup");
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect(`/auth/login?error=${info.message}`);

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let nick = req.body.nick;

  const colorHash = new ColorHash();
  let color = colorHash.hex(username);

  // hash password
  const hash = await bcrypt.hash(password, 12);

  const exUser = await User.findOne({ username: username });
  if (exUser) {
    return res.redirect("/auth/login?error=이미 가입된 회원입니다.");
  } else {
    const user = new User({
      username: username,
      password: hash,
      nick: nick,
      color: color,
    });

    await user.save();
    return res.redirect("/");
  }
});

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
