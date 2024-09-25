const {Router} = require("express")
const authRoutes = require("../routes/authRoutes")
const subscriptionRoutes = require("../routes/subscriptionRoutes")
const transactionRoutes = require("../routes/transactionRoutes")

const setupRoutes = () => {
  const router = Router()

  router.use("/auth", authRoutes)
  router.use("/subscriptions", subscriptionRoutes)
  router.use("/transactions", transactionRoutes)
  
  return router
}

module.exports = setupRoutes
