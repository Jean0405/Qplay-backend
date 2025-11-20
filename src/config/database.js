import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV = "development",
  MYSQL_HOST = "127.0.0.1",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "",
  MYSQL_DATABASE = "exam_app",
} = process.env;

const poolConfig = {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
};

const pool = mysql.createPool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle MySQL client", err);
});

const query = async (text, params) => {
  const start = Date.now();
  const [rows] = await pool.execute(text, params);
  const duration = Date.now() - start;
  if (NODE_ENV !== "production") {
    console.debug("MySQL query", { text, duration, rows: Array.isArray(rows) ? rows.length : 'N/A' });
  }
  
  // Para INSERT, rows contiene insertId y affectedRows
  // Para SELECT, rows es un array
  return { 
    rows: Array.isArray(rows) ? rows : rows,
    rowCount: Array.isArray(rows) ? rows.length : rows.affectedRows 
  };
};

export { pool, query };
export default pool;
