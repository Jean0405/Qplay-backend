import * as QuestionModel from "../models/question.js";
import * as ExamModel from "../models/exam.js";
import * as ExamQuestionModel from "../models/examQuestion.js";
import * as ExamCategoryModel from "../models/examCategory.js";
import { pool } from "../config/database.js";

export const generateExam = async (req, res) => {
  try {
    const { examCategoryId, subjectId, limit = 20 } = req.body;
    if (!examCategoryId)
      return res.status(400).json({ message: "examCategoryId required" });

    const category = await ExamCategoryModel.findById(examCategoryId);
    if (!category)
      return res.status(400).json({ message: "Invalid examCategoryId" });

    const questions = await QuestionModel.getRandomApproved(
      examCategoryId,
      subjectId,
      limit
    );

    const exam = await ExamModel.createExam({
      idUser: req.user.id,
      idExamCategory: examCategoryId,
    });

    const insertRows = questions.map((q) => ({
      idExam: exam.id,
      idQuestion: q.id,
    }));
    await ExamQuestionModel.insertMany(insertRows);

    res.json({ exam, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const submitExam = async (req, res) => {
  const client = await pool.connect();
  try {
    const { examId, answers } = req.body;
    if (!examId || !Array.isArray(answers))
      return res.status(400).json({ message: "Missing examId or answers" });

    const exam = await ExamModel.getById(examId);
    if (!exam || exam.idUser !== req.user.id) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const qIds = answers.map((a) => a.idQuestion);
    const questions = await QuestionModel.findByIds(qIds);

    const correctMap = {};
    for (const q of questions) correctMap[q.id] = q.correctOption;

    let score = 0;
    await client.query("BEGIN");
    try {
      for (const ans of answers) {
        const isCorrect =
          correctMap[ans.idQuestion] &&
          correctMap[ans.idQuestion] === ans.selectedOption;
        if (isCorrect) score += 1;
        await ExamQuestionModel.updateSelectedOption(
          examId,
          ans.idQuestion,
          ans.selectedOption,
          isCorrect,
          client
        );
      }
      await ExamModel.updateScore(examId, score, client);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }

    const breakdown = await ExamQuestionModel.getByExam(examId);

    res.json({ examId, score, breakdown });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

export const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await ExamModel.getById(id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });

    if (exam.idUser !== req.user.id && req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const questions = await ExamQuestionModel.getByExamWithQuestion(id);

    res.json({ exam, questions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const historyMe = async (req, res) => {
  try {
    const exams = await ExamModel.getByUser(req.user.id);
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
