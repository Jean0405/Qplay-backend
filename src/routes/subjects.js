import express from "express";
import { authMiddleware, adminOnly } from "../middleware/middleware.js";
import * as subjectsController from "../controllers/subjects.js";

const router = express.Router();

router.get("/", subjectsController.getSubjects);

router.post(
  "/admin/subjects",
  authMiddleware,
  adminOnly,
  subjectsController.createSubject
);

export default router;
