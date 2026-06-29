import express from "express";
import { getHistory, getHistoryDetail } from "../controllers/historyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getHistory);
router.get("/:id", protect, getHistoryDetail);

export default router;
