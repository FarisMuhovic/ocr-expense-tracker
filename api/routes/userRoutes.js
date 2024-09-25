const express = require("express")
const userController = require("../controllers/userController")
const protect = require("../middleware/authMiddleware")
const router = express.Router()

router.get("/profile", protect, userController.getUserProfile)
router.put("/profile", protect, userController.updateUserProfile)
router.post("/change-password", protect, userController.changePassword)
router.put("/currency", protect, userController.updateCurrency)

module.exports = router
