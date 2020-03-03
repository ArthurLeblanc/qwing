const mongoose = require("mongoose");
//const passwordHash = require("password-hash");
//const jwt = require("jwt-simple");
//const config = require("../config/config");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: true
    },
    pseudo: {
      type : String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("User", userSchema);