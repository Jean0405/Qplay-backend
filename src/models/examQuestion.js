import { query, pool } from "../config/database.js";

export const insertMany = async (rows) => {
  // simple loop insert; acceptable for modest batch sizes
  for (const r of rows) {
    await query(
      `INSERT INTO "ExamQuestion" (idexam, idquestion) VALUES ($1, $2)`,
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
  if (client) {
    return client.query(
      `UPDATE "ExamQuestion" SET selectedoption = $1, iscorrect = $2 WHERE idexam = $3 AND idquestion = $4`,
      [selectedOption, isCorrect, idExam, idQuestion]
    );
  }
  return query(
    `UPDATE "ExamQuestion" SET selectedoption = $1, iscorrect = $2 WHERE idexam = $3 AND idquestion = $4`,
    [selectedOption, isCorrect, idExam, idQuestion]
  );
};

export const getByExam = async (idExam) => {
  const res = await query(
    `SELECT idquestion AS "idQuestion", selectedoption AS "selectedOption", iscorrect AS "isCorrect" FROM "ExamQuestion" WHERE idexam = $1`,
    [idExam]
  );
  return res.rows;
};

export const getByExamWithQuestion = async (idExam) => {
  const sql = `SELECT eq.idquestion AS "idQuestion", eq.selectedoption AS "selectedOption", eq.iscorrect AS "isCorrect",
    q.questiontext AS "questionText", q.optiona AS "optionA", q.optionb AS "optionB", q.optionc AS "optionC", q.optiond AS "optionD", q.correctoption AS "correctOption"
    FROM "ExamQuestion" eq
    JOIN "Question" q ON q.id = eq.idquestion
    WHERE eq.idexam = $1`;
  const res = await query(sql, [idExam]);
  return res.rows;
};
