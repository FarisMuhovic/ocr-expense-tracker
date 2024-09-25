const userService = require("../services/userService")

const getUserProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id)
    res.json(user)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUserProfile(
      req.user.id,
      req.body
    )
    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404).json({message: "User not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const changePassword = async (req, res) => {
  try {
    const updatedUser = await userService.changePassword(
      req.user.id, // Use authenticated user ID
      req.body.currentPassword,
      req.body.newPassword
    )
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const updateCurrency = async (req, res) => {
  try {
    const updatedUser = await userService.updateCurrency(
      req.user.id,
      req.body.currency
    )
    if (updatedUser) {
      res.json(updatedUser)
    } else {
      res.status(404).json({message: "User not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  updateCurrency,
}
