const mongoose = require("mongoose")

const blacklistSchema = new mongoose.Schema({
  // jwt id
  jti: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now,
    index: {expires: "1h"},
  },
})

module.exports = mongoose.model("Blacklist", blacklistSchema)
