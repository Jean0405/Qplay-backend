import { query } from "../config/database.js";

export const insertMany = async (rows) => {
  // simple loop insert; acceptable for modest batch sizes
  for (const r of rows) {
    await query(
      `INSERT INTO ExamQuestion (idExam, idQuestion) VALUES (?, ?)`,
      [r.idExam, r.idQuestion]
    );
  }
};

export const updateSelectedOption = async (
  idExam,
  idQuestion,
  selectedOption,
  isCorrect,
  client = null
) => {
  const sql = `UPDATE ExamQuestion SET selectedOption = ?, isCorrect = ? WHERE idExam = ? AND idQuestion = ?`;
  const params = [selectedOption, isCorrect, idExam, idQuestion];

  if (client) {
    return client.query(sql, params);
  }
  return query(sql, params);
};

export const getByExam = async (idExam) => {
  const res = await query(
    `SELECT idQuestion, selectedOption, isCorrect FROM ExamQuestion WHERE idExam = ?`,
    [idExam]
  );
  return res.rows;
};

export const getByExamWithQuestion = async (idExam) => {
  const sql = `SELECT
    eq.idQuestion,
    eq.selectedOption,
    eq.isCorrect,
    q.questionText,
    q.optionA,
    q.optionB,
    q.optionC,
    q.optionD,
    q.correctOption
    FROM ExamQuestion eq
    JOIN Question q ON q.id = eq.idQuestion
    WHERE eq.idExam = ?`;
  const res = await query(sql, [idExam]);
  return res.rows;
};
