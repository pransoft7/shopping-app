const express = require('express');
const router = express.Router();

const ordersController = require('../controllers/orders.controller')

router.get('/', ordersController.getOrders)
router.post('/', ordersController.placeOrder)

module.exports = router