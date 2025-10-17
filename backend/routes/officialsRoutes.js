import express from "express";
import {
  getOfficials,
  addOfficial,
  updateOfficialById,
  deleteOfficialById
} from "../controllers/officialsController.js";

const router = express.Router();

router.get("/", getOfficials);
router.post("/", addOfficial);
router.put("/:id", updateOfficialById);
router.delete("/:id", deleteOfficialById);

export default router;
