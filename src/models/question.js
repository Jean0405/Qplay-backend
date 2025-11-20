import { query } from "../config/database.js";

export const insert = async (payload) => {
  const dbFields = [
    "questionText",
    "optionA",
    "optionB",
    "optionC",
    "optionD",
    "correctOption",
    "status",
    "idUser",
    "idExamCategory",
    "idSubject",
  ];
  const values = dbFields.map((k) => payload[k]);
  const placeholders = values.map(() => "?").join(", ");
  const sql = `INSERT INTO Question (${dbFields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const res = await query(sql, values);

  // Obtener el registro recién creado
  const newQuestion = await findById(res.rows.insertId);
  return newQuestion;
};

export const getApprovedByCategoryAndSubject = async (
  examCategoryId,
  subjectId
) => {
  const sql = `SELECT id,
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    idUser,
    createdAt
    FROM Question
    WHERE idExamCategory = ? AND idSubject = ? AND status = 'approved'
    ORDER BY createdAt DESC`;
  const res = await query(sql, [examCategoryId, subjectId]);
  return res.rows;
};

export const getPending = async () => {
  const res = await query(
    `SELECT 
      q.id,
      q.questionText,
      q.optionA,
      q.optionB,
      q.optionC,
      q.optionD,
      q.correctOption,
      q.status,
      q.idUser,
      q.idExamCategory,
      q.idSubject,
      q.createdAt,
      u.username AS userName,
      ec.name AS categoryName,
      s.name AS subjectName
    FROM Question q
    INNER JOIN User u ON u.id = q.idUser
    INNER JOIN ExamCategory ec ON ec.id = q.idExamCategory
    INNER JOIN Subject s ON s.id = q.idSubject
    WHERE q.status = 'pending' 
    ORDER BY q.createdAt ASC`
  );
  return res.rows;
};

export const updateStatus = async (id, status) => {
  await query(`UPDATE Question SET status = ? WHERE id = ?`, [status, id]);
};

export const findByIds = async (ids) => {
  // Filtrar valores undefined, null o inválidos
  const validIds = ids.filter((id) => id !== undefined && id !== null && !isNaN(id));

  if (validIds.length === 0) {
    return [];
  }

  const placeholders = validIds.map(() => "?").join(", ");
  const res = await query(
    `SELECT id, correctOption FROM Question WHERE id IN (${placeholders})`,
    validIds
  );
  return res.rows;
};

export const findById = async (id) => {
  const res = await query(
    `SELECT id,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      status,
      idUser,
      idExamCategory,
      idSubject,
      createdAt
      FROM Question WHERE id = ?`,
    [id]
  );
  return res.rows[0];
};

export const getRandomApproved = async (
  examCategoryId,
  subjectId,
  limit = 20
) => {
  // Asegurar que limit sea un número entero válido
  const limitValue = parseInt(limit);

  let sql = `SELECT id,
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    idSubject
    FROM Question 
    WHERE idExamCategory = ? AND status = 'approved'`;

  const params = [examCategoryId];

  if (subjectId !== null && subjectId !== undefined) {
    sql += ` AND idSubject = ?`;
    params.push(subjectId);
  }

  // IMPORTANTE: No usar ? para LIMIT, usar el valor directamente
  sql += ` ORDER BY RAND() LIMIT ${limitValue}`;

  console.log("SQL FINAL:", sql);
  console.log("PARAMS FINAL:", params);

  const res = await query(sql, params);
  return res.rows;
};
