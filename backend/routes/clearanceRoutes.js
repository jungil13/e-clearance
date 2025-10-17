import express from "express";
import * as ClearanceController from "../controllers/clearanceController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js"; // your JWT + Admin middleware

const router = express.Router();

// Authenticated routes
router.use(verifyToken);

// User routes
router.get("/my-clearances", ClearanceController.getUserClearances);
router.post("/request", ClearanceController.requestClearance);

// Admin routes
router.get("/all", isAdmin, ClearanceController.getAllClearances);
router.get("/type/:type", isAdmin, ClearanceController.getClearancesByType);
router.patch("/status/:id", isAdmin, ClearanceController.updateClearanceStatus);
router.delete("/:id", isAdmin, ClearanceController.deleteClearance);

export default router;
