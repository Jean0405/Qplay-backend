import { query } from "../config/database.js";

export const getAll = async () => {
  const res = await query(`SELECT * FROM Subject ORDER BY name`);
  return res.rows;
};

export const create = async ({ name }) => {
  const res = await query(
    `INSERT INTO Subject (name) VALUES (?)`,
    [name]
  );
  
  // Obtener el registro recién creado
  const newRecord = await findById(res.rows.insertId);
  return newRecord;
};

export const update = async (id, { name }) => {
  await query(
    `UPDATE Subject SET name = ? WHERE id = ?`,
    [name, id]
  );
  
  // Retornar el registro actualizado
  const updated = await findById(id);
  return updated;
};

export const deleteById = async (id) => {
  const res = await query(`DELETE FROM Subject WHERE id = ?`, [id]);
  return res.rowCount > 0;
};

export const findById = async (id) => {
  const res = await query(`SELECT * FROM Subject WHERE id = ?`, [id]);
  return res.rows[0];
};
