const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin.controller');
const imageUpload = require('../middlewares/image-upload');

router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProduct);
router.post('/products/new', imageUpload, adminController.createProduct);

router.get('/products/:id', adminController.getProduct);
router.post('/products/:id/update',imageUpload, adminController.updateProduct);

router.delete('/products/:id/delete', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);
router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;