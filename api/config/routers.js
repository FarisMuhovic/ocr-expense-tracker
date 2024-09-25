const {Router} = require("express")
const authRoutes = require("../routes/authRoutes")
const subscriptionRoutes = require("../routes/subscriptionRoutes")
const setupRoutes = () => {
  const router = Router()

  router.use("/auth", authRoutes)
  router.use("/subscriptions", subscriptionRoutes)

  return router
}

module.exports = setupRoutes
