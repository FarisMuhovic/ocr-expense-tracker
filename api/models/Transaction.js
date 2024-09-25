const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Groceries",
      "Transportation",
      "Utilities",
      "Rent/Mortgage",
      "Insurance",
      "Healthcare",
      "Entertainment",
      "Dining Out",
      "Clothing",
      "Education",
      "Travel",
      "Personal Care",
      "Miscellaneous",
    ],
    required: true,
  },
})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction
