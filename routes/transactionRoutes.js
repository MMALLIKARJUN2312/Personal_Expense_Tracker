const express = require('express')
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateUser = require('../middleware/authMiddleware');

router.use(authenticateUser);

router.post('/add', transactionController.addTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/update/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransactionById);
router.get('/summary/:id', transactionController.transactionSummary);
router.get('/monthly-report/:id', transactionController.getMonthlyReport);

module.exports = router;