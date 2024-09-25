const {Router} = require("express")
const router = Router()
const protect = require("../middleware/authMiddleware")
const subscriptionController = require("../controllers/subscriptionsController")

router
  .route("/")
  .get(protect, subscriptionController.getAllSubscriptions) // Get all subscriptions for a user
  .post(protect, subscriptionController.createNewSubscription) // Create a new subscription

router
  .route("/:id")
  .get(protect, subscriptionController.getSubscription) // Get subscription by ID
  .put(protect, subscriptionController.updateSubscription) // Update subscription
  .delete(protect, subscriptionController.deleteSubscription) // Delete subscription

module.exports = router
