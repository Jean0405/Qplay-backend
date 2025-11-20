import express from "express";
import { authMiddleware, adminOnly } from "../middleware/middleware.js";
import * as examCategoriesController from "../controllers/examCategories.js";

const router = express.Router();

router.get("/", examCategoriesController.getCategories);
router.post(
  "/admin/exam-categories",
  authMiddleware,
  adminOnly,
  examCategoriesController.createExamCategory
);

export default router;
