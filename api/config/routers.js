const {Router} = require("express")
const authRoutes = require("../routes/authRoutes")
const subscriptionRoutes = require("../routes/subscriptionRoutes")
const transactionRoutes = require("../routes/transactionRoutes")
const userRoutes = require("../routes/userRoutes")

const setupRoutes = () => {
  const router = Router()

  router.use("/auth", authRoutes)
  router.use("/subscriptions", subscriptionRoutes)
  router.use("/transactions", transactionRoutes)
  router.use("/users", userRoutes)

  return router
}

module.exports = setupRoutes
