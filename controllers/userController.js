const e = require("express");
const UsersModel = require("../model/UsersModel");
const Log = require("../model/LogModel"); // Assuming the Log model is in the same directory
const {
  hashing,
  compareHash,
  generateToken,
  verifyToken,
} = require("../utils/crypt");

//http://localhost:3000/api/users/allUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await UsersModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    // Access uploaded files
    const profilePics = req.files["profilePic"]; // Array of files

    // Save file paths or names to user document if needed
    req.body.profilePic = profilePics.map((file) => file.filename);

    req.body.password = await hashing(req.body.password);
    const user = new UsersModel(req.body);
    const savedUser = await user.save();

    res.status(201).json({
      message: "User Created Successfully!",
      success: true,
      data: savedUser,
    });
  } catch (error) {
    if (error.message.includes("E11000")) {
      res
        .status(400)
        .json({ message: "Email already exists!", success: false });
    } else {
      res
        .status(500)
        .json({
          message: `Internal Server Error ${error.message}`,
          success: false,
        });
    }
  }
};

const addUser = async (req, res) => {
  try {
    const data = req.body;
    const newUser = new UsersModel(data);
    await newUser.save();
    res.status(201).json({ message: "User added successfully", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedUser = await UsersModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    let response = {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
    if (!updatedUser) {
      response = { success: false, message: "User not found" };
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await UsersModel.findByIdAndDelete(id);
    let response = {
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    };
    if (!deletedUser) {
      response = { success: false, message: "User not found" };
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.findOne({ email }).lean();
    if (user) {
      if (user?.isActive && user?.isEmailVerified) {
        const isValidPassword = await compareHash(password, user?.password);
        if (isValidPassword) {
          const token = generateToken({
            id: user._id,
            name: user?.fullName,
            email: user?.email,
            role: user.role,
          });
          res.status(200).json({
            message: "Login Successful",
            success: true,
            data: {
              _id: user?._id,
              name: user?.fullName,
              phone: user?.phone,
              countryCode: user?.countryCode,
              email: user?.email,
              token,
            },
          });
        } else {
          res
            .status(401)
            .json({ message: "Invalid Credentials", success: false });
        }
      } else {
        res.status(401).json({
          message: "Account is not active or email is not verified",
          success: false,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const logUserActivity = async (userId, activity) => {
  try {
    const logEntry = new Log({ userId, activity });
    await logEntry.save();
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
};

module.exports = {
  getAllUsers,
  addUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logUserActivity,
};
