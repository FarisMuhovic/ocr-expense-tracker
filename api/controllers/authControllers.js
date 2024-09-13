const jwt = require("jsonwebtoken")
const User = require("../models/User")
const {hashPassword, comparePasswords} = require("../utils/hashing")
const {generateToken, blacklistToken} = require("../utils/jwt")
const validateAuthPayload = require("../validators/authPayloadValidator")

const registerController = async (req, res) => {
  const {email, password, confirmPassword} = req.body

  const {code, message} = validateAuthPayload(email, password, confirmPassword)

  if (message !== "Validation succeeded") {
    return res.status(code).json(message)
  }

  try {
    const existingUser = await User.findOne({email})
    if (existingUser) {
      return res.status(400).json({message: "User already exists"})
    }

    const hashedPassword = await hashPassword(password)
    const newUser = new User({email, password: hashedPassword})
    await newUser.save()

    return res.status(201).json({message: "User registered successfully"})
  } catch (error) {
    console.error("Error registering user:", error)
    return res
      .status(500)
      .json({message: "Error registering user", error: error.message})
  }
}

const loginController = async (req, res) => {
  const {email, password, rememberMe} = req.body

  const {code, message} = validateAuthPayload(email, password, password)
  if (message !== "Validation succeeded") {
    return res.status(code).json(message)
  }

  try {
    const user = await User.findOne({email})

    if (!user || !(await comparePasswords(password, user.password))) {
      return res.status(401).json({message: "Invalid credentials"})
    }

    const token = generateToken(user.id, rememberMe)
    return res.status(200).json({token})
  } catch (error) {
    console.error("Error logging in:", error)
    return res
      .status(500)
      .json({message: "Error logging in", error: error.message})
  }
}

const logoutController = async (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(400).json({message: "Token is required"})
  }

  try {
    const decoded = jwt.decode(token)
    if (!decoded) {
      return res.status(400).json({message: "Invalid token"})
    }

    const remainingTime = decoded.exp - Math.floor(Date.now() / 1000)
    await blacklistToken(decoded.jti, remainingTime)

    return res.status(200).json({message: "Logged out successfully"})
  } catch (error) {
    console.error("Error logging out:", error)
    return res
      .status(500)
      .json({message: "Error logging out", error: error.message})
  }
}

module.exports = {
  registerController,
  loginController,
  logoutController,
}
