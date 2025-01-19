const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    link: { type: String, required: true },
    modeDescription: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    image: { type: String, required: true },
    image2: { type: String }, // New field for second image
    image3: { type: String }, // New field for third image
    imagePublicId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
