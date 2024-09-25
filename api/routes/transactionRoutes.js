const {Router} = require("express")
const router = Router()
const protect = require("../middleware/authMiddleware")
const transactionController = require("../controllers/transactionController")

router
  .route("/")
  .get(protect, transactionController.getAllTransactions)
  .post(protect, transactionController.createNewTransaction)

router
  .route("/:id")
  .get(protect, transactionController.getTransaction)
  .put(protect, transactionController.updateTransaction)
  .delete(protect, transactionController.deleteTransaction)

module.exports = router
