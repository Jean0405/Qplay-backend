import { query } from "../config/database.js";

export const getAll = async () => {
  const res = await query(`SELECT * FROM "Subject" ORDER BY name`);
  return res.rows;
};

export const create = async ({ name }) => {
  const res = await query(
    `INSERT INTO "Subject" (name) VALUES ($1) RETURNING *`,
    [name]
  );
  return res.rows[0];
};

export const findById = async (id) => {
  const res = await query(`SELECT * FROM "Subject" WHERE id = $1`, [id]);
  return res.rows[0];
};
