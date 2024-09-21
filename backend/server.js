import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import productRoutes from "./router/productRoute.js";
import userRoutes from "./router/userRoute.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./router/orderRoutes.js";
import path from "path"; // Correct import for the path module
import { fileURLToPath } from "url"; // For __dirname in ES6

// Connect to the database
connectDB();

// To use __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(cookieParser());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res, next) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  // Any route that is not API will be redirected to index.html
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, ".../frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Express server started on port ${port}`);
});
