const passport = require("passport");
const bcrypt = require("bcryptjs");
const { Strategy } = require("passport-local");
const User = require("../schemas/user");

module.exports = () => {
  Strategy.use(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const exUser = User.findOne({ username });

        if (exUser) {
          const result = await bcrypt.compare(password, exUser.password);
          if (result) {
            done(null, exUser);
          } else {
            done(null, false, { message: "비밀번호가 일치하지 않습니다." });
          }
        } else {
          done(null, false, { message: "가입되지 않은 회원입니다." });
        }
      } catch (e) {
        console.error(e);
        done(e);
      }
    }
  );
};
