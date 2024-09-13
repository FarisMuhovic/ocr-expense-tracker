const jwt = require("jsonwebtoken")
const Blacklist = require("../models/Blacklist")

const generateToken = (userId, rememberMe = false) => {
  const expiresIn = rememberMe ? "2d" : process.env.JWT_EXPIRATION
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn})
}

const verifyToken = async token => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const isBlacklisted = await Blacklist.findOne({jti: decoded.jti})
    if (isBlacklisted) return null
    return decoded
  } catch (err) {
    return null
  }
}

const blacklistToken = async (jti, expirationInSeconds) => {
  const expireAt = new Date(Date.now() + expirationInSeconds * 1000)
  const blacklistedToken = new Blacklist({jti, expireAt})
  await blacklistedToken.save()
}

module.exports = {
  generateToken,
  verifyToken,
  blacklistToken,
}
