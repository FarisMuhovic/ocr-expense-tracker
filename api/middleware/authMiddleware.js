const {verifyToken} = require("../utils/jwt")

const protect = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({message: "No token provided"})
  }

  const decoded = await verifyToken(token)

  if (!decoded) {
    return res.status(401).json({message: "Invalid or blacklisted token"})
  }

  req.user = decoded // Attach user info to the request
  next()
}

module.exports = protect
