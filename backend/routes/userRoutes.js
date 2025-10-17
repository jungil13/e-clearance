import express from "express";
import {
  registerUser,
  loginUser,
  upload,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  updateUserStatus,
  removeUser,
  forgotPassword,
  resetPassword 
} from "../controllers/userController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js"; // JWT + Admin check

const router = express.Router();

// Public routes
router.post("/register", upload.single("valid_id"), registerUser);
router.post("/login", loginUser);

// Protected routes (require JWT)
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, upload.single("valid_id"), updateProfile);
router.put("/change-password", verifyToken, changePassword);

// Admin-only routes
router.get("/", verifyToken, isAdmin, getAllUsers);
router.put("/:id/status", verifyToken, isAdmin, updateUserStatus);
router.delete("/:id", verifyToken, isAdmin, removeUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
