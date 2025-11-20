import { query } from "../config/database.js";

export const getAll = async () => {
  const res = await query(`SELECT * FROM ExamCategory ORDER BY name`);
  return res.rows;
};

export const create = async ({ name, description }) => {
  const res = await query(
    `INSERT INTO ExamCategory (name, description) VALUES (?, ?)`,
    [name, description]
  );
  
  // Obtener el registro recién creado
  const newRecord = await findById(res.rows.insertId);
  return newRecord;
};

export const findById = async (id) => {
  const res = await query(`SELECT * FROM ExamCategory WHERE id = ?`, [id]);
  return res.rows[0];
};
