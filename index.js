import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./src/routes/auth.js";
import usersRoutes from "./src/routes/users.js";
import examCatRoutes from "./src/routes/examCategories.js";
import subjectsRoutes from "./src/routes/subjects.js";
import questionsRoutes from "./src/routes/questions.js";
import adminRoutes from "./src/routes/admin.js";
import examsRoutes from "./src/routes/exams.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/exam-categories", examCatRoutes);
app.use("/subjects", subjectsRoutes);
app.use("/questions", questionsRoutes);
app.use("/admin", adminRoutes);
app.use("/exams", examsRoutes);

app.get("/", (req, res) => res.send("Exam app backend up"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
