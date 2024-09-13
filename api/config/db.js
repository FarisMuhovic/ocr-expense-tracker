const mongoose = require("mongoose")
const dbUri = process.env.DB_URI || "mongodb://localhost:27017"

const connectDB = async () => {
  try {
    await mongoose.connect(dbUri)
    console.log("Connection to Mongo Database has successed.")
  } catch (err) {
    console.error("Connection to Mongo Database has failed: ", err)
  }
}

module.exports = connectDB
