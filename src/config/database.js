import { Pool } from "pg";

const {
  NODE_ENV = "development",
  DATABASE_URL,
  PG_HOST = "127.0.0.1",
  PG_PORT = 5432,
  PG_USER = "postgres",
  PG_PASSWORD = "",
  PG_DATABASE = "exam_app",
  PG_SSL = "false",
} = process.env;

let poolConfig;
if (DATABASE_URL) {
  poolConfig = {
    connectionString: DATABASE_URL,
    ssl:
      NODE_ENV === "production" || PG_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  poolConfig = {
    host: PG_HOST,
    port: Number(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    ssl: PG_SSL === "true" ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
}

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Unexpected error on idle pg client", err);
});

const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (NODE_ENV !== "production") {
    console.debug("pg query", { text, duration, rows: res.rowCount });
  }
  return res;
};

export { pool, query };
export default pool;
