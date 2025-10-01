const express = require("express");

const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  createUser,
  login,
} = require("../controllers/userController");

const upload = require("../utils/upload").upload;

const router = express.Router();
router.get("/allUsers", getAllUsers);
router.post("/addUser", addUser);
router.post(
  "/createUser",
  upload.fields([{ name: "profilePic", maxCount: 4 }]),
  createUser
);
router.patch("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.post("/login", login);

module.exports = router;
