const passport = require("passport");

const auth = (req, res, next) => {
  passport.authenticate('jwt', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        errorMsg: "¡El usuario no está autenticado!",
        data: info?.message || null
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

module.exports = auth;
