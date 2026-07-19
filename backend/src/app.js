require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.routes");
const productRoute = require("./routes/product.routes");
const orderRoute = require("./routes/order.routes");
const paymentRoute = require("./routes/paymentRoutes");

const app = express();  //  define app first

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
  credentials: true,
}));
app.use(express.json());  //  small 'j'
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/payment", paymentRoute);

module.exports = app;
