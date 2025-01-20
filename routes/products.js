const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadProduct, getProducts, getProductById } = require('../controllers/products');

// Route for product upload
router.post('/upload', upload, uploadProduct);

// Route to get all products
router.get('/', getProducts);

// Route to get a single product by ID
router.get('/:id', getProductById);

module.exports = router;
