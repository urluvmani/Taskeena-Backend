import express from "express";
import { registerController,UpdateUserController,GetUserController, loginController, test, forgotPasswordController } from "../controllers/authController.js";
import { requiresignin, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.put("/update-user",requiresignin,UpdateUserController)
router.get("/admin-auth", requiresignin, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/get-users", requiresignin, isAdmin, GetUserController)
// Example test route (admin only)
router.get("/test", requiresignin, isAdmin, test);

export default router;
