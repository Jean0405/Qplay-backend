import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import * as examsController from "../controllers/exams.js";

const router = express.Router();

router.post("/generate", authMiddleware, examsController.generateExam);
router.post("/submit", authMiddleware, examsController.submitExam);
router.get("/:id", authMiddleware, examsController.getExamById);
router.get("/history/me", authMiddleware, examsController.historyMe);

export default router;
