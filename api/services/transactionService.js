const Transaction = require("../models/Transaction") 

const getTransactions = async userId => {
  return await Transaction.find({userId})
}

const createTransaction = async transactionData => {
  const transaction = new Transaction(transactionData)
  return await transaction.save()
}

const getTransactionById = async id => {
  return await Transaction.findById(id)
}

const updateTransaction = async (id, updateData) => {
  return await Transaction.findByIdAndUpdate(id, updateData, {new: true})
}

const deleteTransaction = async id => {
  return await Transaction.findByIdAndDelete(id)
}

module.exports = {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
}
