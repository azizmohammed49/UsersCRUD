const { verifyToken } = require("../utils/crypt");
const { appLogger, dbLogger } = require("../utils/logger");

const auth = (req, res, next) => {
  try {
    if (req.url.includes("login")) {
      dbLogger.info({
        success: true,
        message: `Login attempt at ${new Date().toISOString()}`,
        time: new Date().toISOString(),
      });
      appLogger.info(`Login attempt at ${new Date().toISOString()}`);

      next();
    } else if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const validToken = verifyToken(token);
      if (validToken) {
        req.decodedToken = validToken;
        appLogger.info(`Authenticated request at ${new Date().toISOString()}`);

        dbLogger.info({
          success: true,
          message: `Authenticated request at ${new Date().toISOString()}`,
          time: new Date().toISOString(),
        });

        next();
      }
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    appLogger.error(
      `Token expired ${err.message} at ${new Date().toISOString()}`
    );

    dbLogger.error({
      success: false,
      message: `Authentication error ${err.message}`,
      time: new Date().toISOString(),
    });
    res.status(401).json({ message: "Token Expired" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    let decodedToken = req.decodedToken;
    if (decodedToken && decodedToken.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = { auth, isAdmin };
