const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs'); // Node.js File System module

exports.uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, link, modeDescription, rating } = req.body;

    if (!name || !description || !price || !category || !link || !modeDescription || !rating || !req.files) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    const imageUploads = await Promise.all(
      (req.files.image ? [req.files.image] : [])
        .concat(req.files.image2 ? [req.files.image2] : [])
        .concat(req.files.image3 ? [req.files.image3] : [])
        .map(file => cloudinary.uploader.upload(file[0].path, { folder: 'products' }))
    );

    const product = new Product({
      name,
      description,
      price,
      category,
      link,
      modeDescription,
      rating,
      image: imageUploads[0]?.secure_url,
      image2: imageUploads[1]?.secure_url,
      image3: imageUploads[2]?.secure_url,
      imagePublicId: imageUploads[0]?.public_id,
    });

    await product.save();

    // Clean up local files after successful upload
    const deleteLocalFiles = (files) => {
      files.forEach(file => {
        if (file && file[0] && file[0].path) {
          fs.unlink(file[0].path, (err) => {
            if (err) console.error(`Failed to delete file ${file[0].path}:`, err);
          });
        }
      });
    };

    deleteLocalFiles([req.files.image, req.files.image2, req.files.image3]);

    res.status(201).json({ message: 'Product uploaded successfully!', product });
  } catch (error) {
    console.error('Error uploading product:', error);
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

// Fetch a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product details', error });
  }
};

