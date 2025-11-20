import express from "express";
import { authMiddleware, adminOnly } from "../middleware/middleware.js";
import * as adminController from "../controllers/admin.js";

const router = express.Router();

router.get(
  "/questions/pending",
  authMiddleware,
  adminOnly,
  adminController.getPendingQuestions
);

router.patch(
  "/questions/:id/status",
  authMiddleware,
  adminOnly,
  adminController.updateQuestionStatus
);

export default router;
