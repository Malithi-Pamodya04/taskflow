import { pool } from '../config/db.js';

export async function getStats(req, res, next) {
  try {
    const userId = req.user.id;

    // One query computes all the counts. CURDATE() is today's date on the DB server.
    const [summary] = await pool.execute(
      `SELECT
         COUNT(*)                                                         AS total,
         COALESCE(SUM(status = 'completed'), 0)                           AS completed,
         COALESCE(SUM(status <> 'completed'), 0)                          AS pending,
         COALESCE(SUM(status <> 'completed' AND deadline < CURDATE()), 0) AS overdue
       FROM tasks
       WHERE user_id = ?`,
      [userId]
    );

    const [byStatus] = await pool.execute(
      'SELECT status, COUNT(*) AS count FROM tasks WHERE user_id = ? GROUP BY status',
      [userId]
    );

    const [byPriority] = await pool.execute(
      'SELECT priority, COUNT(*) AS count FROM tasks WHERE user_id = ? GROUP BY priority',
      [userId]
    );

    const s = summary[0];
    res.json({
      totalTasks: Number(s.total),
      completedTasks: Number(s.completed),
      pendingTasks: Number(s.pending),
      overdueTasks: Number(s.overdue),
      byStatus,
      byPriority,
    });
  } catch (err) {
    next(err);
  }
}