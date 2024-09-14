const jwt = require("jsonwebtoken")
const User = require("../models/User")
const {hashPassword, comparePasswords} = require("../utils/hashing")
const {generateToken, blacklistToken} = require("../utils/jwt")
const validateAuthPayload = require("../validators/authPayloadValidator")

const register = async (email, password, confirmPassword) => {
  const {code, message} = validateAuthPayload(email, password, confirmPassword)

  if (message !== "Validation succeeded") {
    return {code, message}
  }

  const existingUser = await User.findOne({email})
  if (existingUser) {
    return {code: 400, message: "User already exists"}
  }

  const hashedPassword = await hashPassword(password)
  const newUser = new User({email, password: hashedPassword})
  await newUser.save()

  return {code: 201, message: "User registered successfully"}
}

const login = async (email, password, rememberMe) => {
  const {code, message} = validateAuthPayload(email, password, password)
  if (message !== "Validation succeeded") {
    return {code, message}
  }

  const user = await User.findOne({email})

  if (!user || !(await comparePasswords(password, user.password))) {
    return {code: 401, message: "Invalid credentials"}
  }

  const token = generateToken(user.id, rememberMe)
  return {code: 200, token}
}

const logout = async token => {
  const decoded = jwt.decode(token)
  if (!decoded) {
    return {code: 400, message: "Invalid token"}
  }

  const remainingTime = decoded.exp - Math.floor(Date.now() / 1000)
  await blacklistToken(decoded.jti, remainingTime)

  return {code: 200, message: "Logged out successfully"}
}

module.exports = {
  register,
  login,
  logout,
}
