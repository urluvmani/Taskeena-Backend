// routes/orderRoutes.js
import express from "express";
import { createOrderController,DeleteOrderController,GetAllOrderController,UpdateOrderPaymentStatusController,UpdateOrderStatusController,GetOrderController, paymentReturnController, HasPurchasedController } from "../controllers/orderController.js";
import { isAdmin, requiresignin } from "../middleware/authMiddleware.js";

const router = express.Router();

// user must be logged in to create an order
router.post("/create", requiresignin, createOrderController);

// mock payment return (no auth required)
router.post("/payment-return", paymentReturnController);

router.get("/my-orders", requiresignin, GetOrderController)

router.get("/all-orders",requiresignin, isAdmin, GetAllOrderController)

router.put("/update-status/:orderId", requiresignin, isAdmin, UpdateOrderStatusController);
router.put("/update-payment-status/:orderId", requiresignin, isAdmin, UpdateOrderPaymentStatusController);

router.delete("/delete-order/:orderId", requiresignin, DeleteOrderController)

// ✅ routes/orderRoutes.js
router.get("/has-purchased/:productId", requiresignin, HasPurchasedController);

export default router;
