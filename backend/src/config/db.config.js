const mongoose = require("mongoose");
const { productModel } = require("../models/product.model");
const { initialProducts } = require("./products.seed");

exports.connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://localhost:27017/Mernecommerce";
    await mongoose.connect(connUri);
    console.log("MongoDB connected successfully.");

    // Seed products if collection is empty
    const productCount = await productModel.countDocuments();
    if (productCount === 0) {
      console.log("Seeding products to database...");
      await productModel.insertMany(initialProducts);
      console.log("Products seeded successfully.");
    }
  } catch (error) {
    console.log("Error connecting to Database: ", error.message);
  }
};
