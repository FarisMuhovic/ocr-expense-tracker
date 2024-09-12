require("dotenv").config()
const express = require("express")
const connectDB = require("./config/db")
const {configureServer, startServer} = require("./config/config")

const app = express()
const {port} = configureServer(app)

connectDB()
  .then(() => {
    startServer(app, port)
  })
  .catch(err => {
    console.error(`Error starting server: ${err.message}`)
  })
