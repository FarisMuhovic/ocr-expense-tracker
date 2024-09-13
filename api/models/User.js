const mongoose = require("mongoose")
const crypto = require("crypto")

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
})

const User = mongoose.model("User", userSchema)

module.exports = User
