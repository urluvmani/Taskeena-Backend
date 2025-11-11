import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user._id;

    // ✅ Directly create a new review (no purchase or duplicate checks)
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    await review.save();

    // ✅ Recalculate average rating
    const reviews = await Review.find({ product: productId });
    const numReviews = reviews.length;
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await Product.findByIdAndUpdate(productId, { avgRating, numReviews });

    res.json({ success: true, message: "Review added successfully", review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
