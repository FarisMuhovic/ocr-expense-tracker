const transactionService = require("../services/transactionService") 

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user.id)
    res.json(transactions)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const createNewTransaction = async (req, res) => {
  try {
    const {id: userId} = req.user

    const transaction = await transactionService.createTransaction({
      ...req.body,
      userId,
    })

    res.status(201).json(transaction)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const getTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id
    )
    if (transaction) {
      res.json(transaction)
    } else {
      res.status(404).json({message: "Transaction not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await transactionService.updateTransaction(
      req.params.id,
      req.body
    )
    if (updatedTransaction) {
      res.json(updatedTransaction)
    } else {
      res.status(404).json({message: "Transaction not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await transactionService.deleteTransaction(
      req.params.id
    )
    if (deletedTransaction) {
      res.json({message: "Transaction deleted"})
    } else {
      res.status(404).json({message: "Transaction not found"})
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

module.exports = {
  getAllTransactions,
  createNewTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
}
