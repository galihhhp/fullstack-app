import pkg from "pg";
import dotenv from "dotenv";
import { Counter, Histogram, Gauge, Registry } from "prom-client";

dotenv.config();

const TABLE = process.env.DB_USERS_TABLE || "users";
const COLUMN_ID = process.env.DB_USERS_COLUMN_ID || "id";
const COLUMN_EMAIL = process.env.DB_USERS_COLUMN_EMAIL || "email";
const COLUMN_NAME = process.env.DB_USERS_COLUMN_NAME || "name";

type DatabaseOperation =
  | "SELECT_USERS"
  | "SELECT_USER_BY_ID"
  | "INSERT_USER"
  | "UPDATE_USER"
  | "DELETE_USER";

const { Pool } = pkg;

let databaseOperationsTotal: Counter<string>;
let databaseOperationDuration: Histogram<string>;
let databaseConnectionsActive: Gauge<string>;

export const initializeDatabaseMetrics = (register: Registry) => {
  databaseOperationsTotal = new Counter({
    name: "database_operations_total",
    help: "Total number of database operations",
    labelNames: ["operation", "status"],
    registers: [register],
  });

  databaseOperationDuration = new Histogram({
    name: "database_operation_duration_seconds",
    help: "Duration of database operations in seconds",
    labelNames: ["operation"],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
    registers: [register],
  });

  databaseConnectionsActive = new Gauge({
    name: "database_connections_active",
    help: "Number of active database connections",
    registers: [register],
  });
};

export const getDatabaseMetrics = () => ({
  databaseOperationsTotal,
  databaseOperationDuration,
  databaseConnectionsActive,
});

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "postgres",
  connectionTimeoutMillis: 10000,
});

export const setupDatabasePoolEvents = () => {
  pool.on("connect", () => {
    if (databaseConnectionsActive) {
      databaseConnectionsActive.inc();
    }
  });

  pool.on("remove", () => {
    if (databaseConnectionsActive) {
      databaseConnectionsActive.dec();
    }
  });
};

type UserRow = {
  [key: string]: any;
};

const executeQuery = async <T>(
  operation: DatabaseOperation,
  query: string,
  params: any[] = []
): Promise<T> => {
  const timer = databaseOperationDuration?.startTimer({ operation });
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(query, params);
      timer?.();
      databaseOperationsTotal?.inc({ operation, status: "success" });
      return result.rows as T;
    } finally {
      client.release();
    }
  } catch (err) {
    timer?.();
    databaseOperationsTotal?.inc({ operation, status: "error" });
    throw err;
  }
};

const toUser = (row: UserRow) => ({
  id: row[COLUMN_ID],
  email: row[COLUMN_EMAIL],
  name: row[COLUMN_NAME],
});

export const listUsers = async () => {
  const rows = await executeQuery<UserRow[]>(
    "SELECT_USERS",
    `SELECT ${COLUMN_ID}, ${COLUMN_EMAIL}, ${COLUMN_NAME} FROM ${TABLE} ORDER BY ${COLUMN_ID} ASC`
  );
  return rows.map(toUser);
};

export const getUserById = async (id: string) => {
  const rows = await executeQuery<UserRow[]>(
    "SELECT_USER_BY_ID",
    `SELECT ${COLUMN_ID}, ${COLUMN_EMAIL}, ${COLUMN_NAME} FROM ${TABLE} WHERE ${COLUMN_ID} = $1`,
    [id]
  );
  if (rows.length === 0) {
    return null;
  }
  return toUser(rows[0]);
};

export const createUser = async (email: string, name: string) => {
  const rows = await executeQuery<UserRow[]>(
    "INSERT_USER",
    `INSERT INTO ${TABLE}(${COLUMN_EMAIL}, ${COLUMN_NAME}) VALUES($1, $2) RETURNING ${COLUMN_ID}, ${COLUMN_EMAIL}, ${COLUMN_NAME}`,
    [email, name]
  );
  return toUser(rows[0]);
};

export const updateUser = async (id: string, email: string, name: string) => {
  const rows = await executeQuery<UserRow[]>(
    "UPDATE_USER",
    `UPDATE ${TABLE} SET ${COLUMN_EMAIL} = $1, ${COLUMN_NAME} = $2 WHERE ${COLUMN_ID} = $3 RETURNING ${COLUMN_ID}, ${COLUMN_EMAIL}, ${COLUMN_NAME}`,
    [email, name, id]
  );
  if (rows.length === 0) {
    return null;
  }
  return toUser(rows[0]);
};

export const deleteUser = async (id: string) => {
  const rows = await executeQuery<UserRow[]>(
    "DELETE_USER",
    `DELETE FROM ${TABLE} WHERE ${COLUMN_ID} = $1 RETURNING ${COLUMN_ID}`,
    [id]
  );
  if (rows.length === 0) {
    return null;
  }
  return { id: rows[0][COLUMN_ID] };
};
