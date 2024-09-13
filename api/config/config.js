const express = require("express")
const cors = require("cors")
const setupRoutes = require("./routers")

const configureServer = app => {
  const port = process.env.PORT || 3000
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173" // vite default port

  app.use(express.json())
  app.use(
    cors({
      origin: clientUrl,
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      credentials: true,
    })
  )
  app.use("/api/v1", setupRoutes())
  return {port}
}

const startServer = (app, port) => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

module.exports = {configureServer, startServer}
