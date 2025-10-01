const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number },
    countryCode: { type: String },
    isActive: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    profilePic: [{ type: String }],
    role: {
      type: String,
      default: "USER",
      enum: ["USER", "ADMIN", "SUPERADMIN"],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("Users", userSchema);

User.createIndexes({ email: 1 });
module.exports = User;
