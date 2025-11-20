import { query } from "../config/database.js";

export const createUser = async ({
  username,
  email,
  password,
  role = "user",
}) => {
  const sql = `INSERT INTO User (username, email, password, role)
    VALUES (?, ?, ?, ?)`;
  const res = await query(sql, [username, email, password, role]);

  // Obtener el usuario recién creado
  const userId = res.rows.insertId;
  const user = await findById(userId);
  return user;
};

export const findById = async (id) => {
  const res = await query(
    `SELECT id, username, email, role, createdAt FROM User WHERE id = ?`,
    [id]
  );
  return res.rows[0];
};

export const findByEmail = async (email) => {
  const res = await query(
    `SELECT * FROM User WHERE LOWER(email) = LOWER(?) LIMIT 1`,
    [email]
  );
  return res.rows[0];
};

export const findByUsername = async (username) => {
  const res = await query(
    `SELECT * FROM User WHERE LOWER(username) = LOWER(?) LIMIT 1`,
    [username]
  );
  return res.rows[0];
};

export const getRanking = async (examCategoryId, limit = 100) => {
  const limitValue = parseInt(limit);
  const sql = `SELECT u.id as userId, u.username, MAX(e.score) as bestScore
     FROM Exam e
     JOIN User u ON u.id = e.idUser
     WHERE e.idExamCategory = ?
     GROUP BY u.id, u.username
     ORDER BY bestScore DESC
     LIMIT ${limitValue}`;
  const res = await query(sql, [examCategoryId]);
  return res.rows;
};
