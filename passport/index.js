const passport = require("passport");
const local = require("./localStrategy");
const User = require("../schemas/user");

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (_id, done) => {
    try {
      // password: false -> password 필드를 제외하고 조회
      const user = await User.findOne({ _id }, { password: false });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  local();
};
