import express from "express";
import { addReview, getProductReviews } from "../controllers/reviewController.js";
import { requiresignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add review (only logged in user)
router.post("/add/:productId", requiresignin, addReview);

// Get all reviews for a product
router.get("/:productId", getProductReviews);

export default router;
