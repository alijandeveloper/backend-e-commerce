const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

exports.uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, link, modeDescription, rating } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !link || !modeDescription || !rating || !req.file) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'products' });

    // Create and save the product
    const product = new Product({
      name,
      description,
      price,
      category,
      link,
      modeDescription,
      rating,
      image: result.secure_url,
      imagePublicId: result.public_id,
    });

    await product.save();
    res.status(201).json({ message: 'Product uploaded successfully!', product });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};
