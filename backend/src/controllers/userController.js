import { pool } from '../config/db.js';

// Admin only: list all users with their task counts.
export async function listUsers(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id, u.name, u.email, u.role, u.created_at, COUNT(t.id) AS task_count
       FROM users u
       LEFT JOIN tasks t ON t.user_id = u.id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json({ users: rows.map((r) => ({ ...r, task_count: Number(r.task_count) })) });
  } catch (err) {
    next(err);
  }
}