const {Router} = require("express")
const router = Router()
const protect = require("../middleware/authMiddleware")
const authController = require("../controllers/authController")

router.post("/register", authController.registerController)
router.post("/login", authController.loginController)
router.post("/logout", protect, authController.logoutController)

module.exports = router
