import { query } from "../config/database.js";

export const createExam = async ({ idUser, idExamCategory }) => {
  const res = await query(
    `INSERT INTO Exam (idUser, idExamCategory) VALUES (?, ?)`,
    [idUser, idExamCategory]
  );

  // En MySQL, insertId está en el objeto rows directamente
  const newExam = await getById(res.rows.insertId);
  return newExam;
};

export const getById = async (id) => {
  const res = await query(
    `SELECT id, idUser, idExamCategory, score, takenAt FROM Exam WHERE id = ?`,
    [id]
  );
  return res.rows[0];
};

export const updateScore = async (id, score) => {
  await query(`UPDATE Exam SET score = ? WHERE id = ?`, [score, id]);
};

export const getByUser = async (idUser) => {
  const res = await query(
    `SELECT id, idUser, idExamCategory, score, takenAt FROM Exam WHERE idUser = ? ORDER BY takenAt DESC`,
    [idUser]
  );
  return res.rows;
};
