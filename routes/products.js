const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const { uploadProduct, getProducts } = require('../controllers/products');

router.post('/upload', upload.single('image'), uploadProduct);
router.get('/', getProducts);

module.exports = router;
