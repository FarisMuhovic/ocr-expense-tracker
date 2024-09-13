const {Router} = require("express")
const authRoutes = require("../routes/authRoutes")

const setupRoutes = () => {
  const router = Router()

  router.use("/auth", authRoutes)

  return router
}

module.exports = setupRoutes
