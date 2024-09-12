const mongoose = require("mongoose")
const DB_URI = process.env.DB_URI || "mongodb://localhost:27017"

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI)
    console.log("Connection to Mongo Database has successed.")
  } catch (err) {
    console.error(err)
  }
}

module.exports = connectDB
