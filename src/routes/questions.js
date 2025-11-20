import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import * as questionsController from "../controllers/questions.js";

const router = express.Router();

router.get(
  "/:examCategoryId/:subjectId",
  questionsController.getQuestionsByCategoryAndSubject
);

router.post(
  "/recommend",
  authMiddleware,
  questionsController.recommendQuestion
);

export default router;
