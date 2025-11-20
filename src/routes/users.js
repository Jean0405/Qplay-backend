import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import * as usersController from "../controllers/users.js";

const router = express.Router();

router.get("/me", authMiddleware, usersController.getMe);
router.get("/ranking/:examCategoryId", usersController.getRanking);

export default router;
