import * as ExamModel from "../models/exam.js";
import * as QuestionModel from "../models/question.js";
import * as ExamQuestionModel from "../models/examQuestion.js";
import { pool } from "../config/database.js";

export const generateExam = async (req, res) => {
  try {
    const { examCategoryId, subjectId, limit = 20 } = req.body;

    if (!examCategoryId) {
      return res.status(400).json({ message: "examCategoryId is required" });
    }

    // Convertir a números enteros
    const categoryId = parseInt(examCategoryId);
    const subjId = subjectId ? parseInt(subjectId) : null;
    const limitNumber = parseInt(limit);

    console.log("CONTROLLER --> ",categoryId,subjId,limitNumber);
    

    // Validar que sean números válidos
    if (isNaN(categoryId) || isNaN(limitNumber)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Obtener preguntas aleatorias
    const questions = await QuestionModel.getRandomApproved(
      categoryId,
      subjId,
      limitNumber
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: "No approved questions found" });
    }

    // Crear el examen
    const exam = await ExamModel.createExam({
      idUser: req.user.id,
      idExamCategory: categoryId,
    });

    // Insertar las preguntas asociadas al examen
    const examQuestionRows = questions.map(q => ({
      idExam: exam.id,
      idQuestion: q.id
    }));
    
    await ExamQuestionModel.insertMany(examQuestionRows);

    res.json({
      ...exam,
      questions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const submitExam = async (req, res) => {
  const client = await pool.getConnection();
  try {
    const { examId, answers } = req.body;
    
    console.log("SUBMIT DATA:", { examId, answers });
    
    if (!examId || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Missing examId or answers" });
    }

    // Validar que cada respuesta tenga los campos necesarios
    for (const ans of answers) {
      if (!ans.questionId || !ans.selectedOption) {
        return res.status(400).json({ 
          message: "Each answer must have questionId and selectedOption" 
        });
      }
    }

    const exam = await ExamModel.getById(examId);
    if (!exam || exam.idUser !== req.user.id) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const qIds = answers.map((a) => a.questionId);
    const questions = await QuestionModel.findByIds(qIds);

    const correctMap = {};
    for (const q of questions) correctMap[q.id] = q.correctOption;

    let score = 0;
    await client.query("BEGIN");
    try {
      for (const ans of answers) {
        const isCorrect =
          correctMap[ans.questionId] &&
          correctMap[ans.questionId] === ans.selectedOption;
        if (isCorrect) score += 1;
        await ExamQuestionModel.updateSelectedOption(
          examId,
          ans.questionId,
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
