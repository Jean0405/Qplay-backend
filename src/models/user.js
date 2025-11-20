import { query } from "../config/database.js";

export const createUser = async ({
  username,
  email,
  password,
  role = "user",
}) => {
  const sql = `INSERT INTO "User" (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, email, role, createdat AS "createdAt"`;
  const res = await query(sql, [username, email, password, role]);
  return res.rows[0];
};

export const findById = async (id) => {
  const res = await query(
    `SELECT id, username, email, role, createdat AS "createdAt" FROM "User" WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

export const findByEmail = async (email) => {
  const res = await query(
    `SELECT * FROM "User" WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  );
  return res.rows[0];
};

export const findByUsername = async (username) => {
  const res = await query(
    `SELECT * FROM "User" WHERE lower(username) = lower($1) LIMIT 1`,
    [username]
  );
  return res.rows[0];
};

export const getRanking = async (examCategoryId, limit = 100) =>
  query(
    `SELECT u.id as "userId", u.username, MAX(e.score) as "bestScore"
     FROM "Exam" e
     JOIN "User" u ON u.id = e.iduser
     WHERE e.idexamcategory = $1
     GROUP BY u.id, u.username
     ORDER BY "bestScore" DESC
     LIMIT $2`,
    [examCategoryId, limit]
  ).then((r) => r.rows);
