import { query } from "../config/database.js";

export const insert = async (payload) => {
  const dbFields = [
    "questiontext",
    "optiona",
    "optionb",
    "optionc",
    "optiond",
    "correctoption",
    "status",
    "iduser",
    "idexamcategory",
    "idsubject",
  ];
  const payloadKeys = [
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
  const values = payloadKeys.map((k) => payload[k]);
  const params = values.map((_, i) => `$${i + 1}`).join(", ");
  const sql = `INSERT INTO "Question" (${dbFields.join(
    ","
  )}) VALUES (${params}) RETURNING id, questiontext AS "questionText", status`;
  const res = await query(sql, values);
  return res.rows[0];
};

export const getApprovedByCategoryAndSubject = async (
  examCategoryId,
  subjectId
) => {
  const sql = `SELECT id,
    questiontext AS "questionText",
    optiona AS "optionA",
    optionb AS "optionB",
    optionc AS "optionC",
    optiond AS "optionD",
    iduser AS "idUser",
    createdat AS "createdAt"
    FROM "Question"
    WHERE idexamcategory = $1 AND idsubject = $2 AND status = 'approved'
    ORDER BY createdat DESC`;
  const res = await query(sql, [examCategoryId, subjectId]);
  return res.rows;
};

export const getPending = async () => {
  const res = await query(
    `SELECT id,
      questiontext AS "questionText",
      optiona AS "optionA",
      optionb AS "optionB",
      optionc AS "optionC",
      optiond AS "optionD",
      correctoption AS "correctOption",
      status,
      iduser AS "idUser",
      idexamcategory AS "idExamCategory",
      idsubject AS "idSubject",
      createdat AS "createdAt"
      FROM "Question" WHERE status = 'pending' ORDER BY createdat ASC`
  );
  return res.rows;
};

export const updateStatus = async (id, status) => {
  await query(`UPDATE "Question" SET status = $1 WHERE id = $2`, [status, id]);
};

export const findByIds = async (ids) => {
  const res = await query(
    `SELECT id, correctoption AS "correctOption" FROM "Question" WHERE id = ANY($1)`,
    [ids]
  );
  return res.rows;
};

export const findById = async (id) => {
  const res = await query(
    `SELECT id,
      questiontext AS "questionText",
      optiona AS "optionA",
      optionb AS "optionB",
      optionc AS "optionC",
      optiond AS "optionD",
      correctoption AS "correctOption",
      status,
      iduser AS "idUser",
      idexamcategory AS "idExamCategory",
      idsubject AS "idSubject",
      createdat AS "createdAt"
      FROM "Question" WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

export const getRandomApproved = async (
  examCategoryId,
  subjectId,
  limit = 20
) => {
  let sql = `SELECT id,
    questiontext AS "questionText",
    optiona AS "optionA",
    optionb AS "optionB",
    optionc AS "optionC",
    optiond AS "optionD",
    idsubject AS "idSubject"
    FROM "Question" WHERE idexamcategory = $1 AND status = 'approved'`;
  const params = [examCategoryId];
  if (subjectId) {
    params.push(subjectId);
    sql += ` AND idsubject = $${params.length}`;
  }
  sql += ` ORDER BY RANDOM() LIMIT $${params.length + 1}`;
  params.push(limit);
  const res = await query(sql, params);
  return res.rows;
};
