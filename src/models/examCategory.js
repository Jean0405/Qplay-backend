import { query } from "../config/database.js";

export const getAll = async () => {
  const res = await query(`SELECT * FROM "ExamCategory" ORDER BY name`);
  return res.rows;
};

export const create = async ({ name, description }) => {
  const res = await query(
    `INSERT INTO "ExamCategory" (name, description) VALUES ($1, $2) RETURNING *`,
    [name, description]
  );
  return res.rows[0];
};

export const findById = async (id) => {
  const res = await query(`SELECT * FROM "ExamCategory" WHERE id = $1`, [id]);
  return res.rows[0];
};
