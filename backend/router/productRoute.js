import express from "express";

import {
  getProducts,
  getProductsById,
  createProductReview,
  getTopProducts,
  createProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router.get("/:id", getProductsById);

router.route("/:id/reviews").post(protect, createProductReview);

export default router;
