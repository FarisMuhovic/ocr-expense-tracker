const mongoose = require("mongoose")
const crypto = require("crypto")
const {comparePasswords} = require("../utils/hashing") // Import your compare function

// User schema definition
const userSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => crypto.randomUUID(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: false, // Not required
  },
  lastName: {
    type: String,
    required: false, // Not required
  },
  currency: {
    type: String,
    enum: ["EUR", "USD", "KM"], // Available currency options
    default: "EUR", // Default currency
  },
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await comparePasswords(password, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User
