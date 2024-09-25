const User = require("../models/User")
const {hashPassword} = require("../utils/hashing")

const getUserById = async userId => {
  return await User.findById(userId)
}

const updateUserProfile = async (userId, profileData) => {
  return await User.findByIdAndUpdate(userId, profileData, {new: true})
}

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new Error("User not found")
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword)
  if (!isMatch) {
    throw new Error("Current password is incorrect")
  }

  // Hash new password and update user
  const hashedPassword = await hashPassword(newPassword) // Ensure hashPassword utility is defined
  return await User.findByIdAndUpdate(
    userId,
    {password: hashedPassword},
    {new: true}
  )
}

const updateCurrency = async (userId, currency) => {
  return await User.findByIdAndUpdate(userId, {currency}, {new: true})
}

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
  updateCurrency,
}
