const AuthService = require("../services/authService")

const registerController = async (req, res) => {
  const {email, password, confirmPassword} = req.body

  try {
    const {code, message, token} = await AuthService.register(
      email,
      password,
      confirmPassword
    )
    if (token) {
      return res.status(code).json({message, token})
    } else {
      return res.status(code).json({message})
    }
  } catch (error) {
    console.error("Error registering user:", error)
    return res
      .status(500)
      .json({message: "Error registering user", error: error.message})
  }
}

const loginController = async (req, res) => {
  const {email, password, rememberMe} = req.body

  try {
    const {code, token, message} = await AuthService.login(
      email,
      password,
      rememberMe
    )
    if (token) {
      return res.status(code).json({token})
    } else {
      return res.status(code).json({message})
    }
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
    const {code, message} = await AuthService.logout(token)
    return res.status(code).json({message})
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
