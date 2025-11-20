import { query } from "../config/database.js";

export const createExam = async ({ idUser, idExamCategory }) => {
  const res = await query(
    `INSERT INTO "Exam" (iduser, idexamcategory) VALUES ($1, $2) RETURNING id, iduser AS "idUser", idexamcategory AS "idExamCategory", score, takenat AS "takenAt"`,
    [idUser, idExamCategory]
  );
  return res.rows[0];
};

export const getById = async (id) => {
  const res = await query(
    `SELECT id, iduser AS "idUser", idexamcategory AS "idExamCategory", score, takenat AS "takenAt" FROM "Exam" WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

export const updateScore = async (id, score, client = null) => {
  if (client) {
    await client.query(`UPDATE "Exam" SET score = $1 WHERE id = $2`, [
      score,
      id,
    ]);
  } else {
    await query(`UPDATE "Exam" SET score = $1 WHERE id = $2`, [score, id]);
  }
};

export const getByUser = async (idUser) => {
  const res = await query(
    `SELECT id, iduser AS "idUser", idexamcategory AS "idExamCategory", score, takenat AS "takenAt" FROM "Exam" WHERE iduser = $1 ORDER BY takenat DESC`,
    [idUser]
  );
  return res.rows;
};
