import 'dotenv/config';
import mysql from 'mysql2/promise';

// A pool reuses connections instead of opening a new one per request.
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true, // return DATE columns as 'YYYY-MM-DD' strings, avoiding timezone bugs
});