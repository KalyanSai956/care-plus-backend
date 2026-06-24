const authorize =
  (...roles) =>
  (req, res, next) => {
    if (
      !roles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied",
      });
    }

    next();
  };

module.exports = authorize;