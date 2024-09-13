const {Router} = require("express")
const router = Router()
const {
  registerController,
  loginController,
  logoutController,
} = require("../controllers/authControllers")
const protect = require("../middleware/authMiddleware")

router.post("/register", registerController)
router.post("/login", loginController)
router.post("/logout", protect, logoutController)

module.exports = router
