const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashing = (plainText) => {
  return bcrypt.hash(plainText, 5);
};

const compareHash = (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  // Implementation for generating a token (e.g., JWT)
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // or handle the error as needed
  }
  // Implementation for verifying a token (e.g., JWT)
};

module.exports = { hashing, compareHash, generateToken, verifyToken };
