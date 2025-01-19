const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary'); // Ensure you have Cloudinary config set up

exports.uploadProduct = async (req, res) => {
  try {
    const { name, description, price, category, link, modeDescription, rating } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !link || !modeDescription || !rating || !req.files) {
      return res.status(400).json({ message: 'All fields are required!' });
    }

    // Check if images exist and upload to Cloudinary
    const imageUploads = await Promise.all(
      (req.files.image ? [req.files.image] : [])
        .concat(req.files.image2 ? [req.files.image2] : [])
        .concat(req.files.image3 ? [req.files.image3] : [])
        .map(file => cloudinary.uploader.upload(file[0].path, { folder: 'products' }))
    );

    // Create and save the product in the database
    const product = new Product({
      name,
      description,
      price,
      category,
      link,
      modeDescription,
      rating,
      image: imageUploads[0]?.secure_url,
      image2: imageUploads[1]?.secure_url, // Handle multiple images
      image3: imageUploads[2]?.secure_url,
      imagePublicId: imageUploads[0]?.public_id, // Store public IDs for Cloudinary deletion
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
