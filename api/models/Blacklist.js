const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
  jti: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires: "3h"},
  },
})

module.exports = mongoose.model("Blacklist", blacklistSchema)
