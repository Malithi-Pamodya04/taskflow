import { pool } from '../config/db.js';

const COLUMNS = 'id, title, description, priority, status, deadline, created_at, updated_at';

export async function createTask(req, res, next) {
  try {
    const { title, description = null, priority = 'medium', status = 'todo', deadline = null } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO tasks (user_id, title, description, priority, status, deadline) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, priority, status, deadline]
    );
    const [rows] = await pool.execute(`SELECT ${COLUMNS} FROM tasks WHERE id = ?`, [result.insertId]);
    res.status(201).json({ task: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getTasks(req, res, next) {
  try {
    const { search, status, priority, sort = 'created', order = 'desc' } = req.query;

    // Always scope to the logged-in user (ownership check).
    const conditions = ['user_id = ?'];
    const params = [req.user.id];

    if (search) {
      conditions.push('title LIKE ?');
      params.push(`%${search}%`);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (priority) {
      conditions.push('priority = ?');
      params.push(priority);
    }

    // Column and direction come from a whitelist, never directly from user input.
    const sortColumn = sort === 'deadline' ? 'deadline' : 'created_at';
    const direction = order === 'asc' ? 'ASC' : 'DESC';

    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY ${sortColumn} ${direction}, id DESC`,
      params
    );
    res.json({ count: rows.length, tasks: rows });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT ${COLUMNS} FROM tasks WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ task: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const allowed = ['title', 'description', 'priority', 'status', 'deadline'];
    const fields = [];
    const params = [];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        fields.push(`${key} = ?`);
        params.push(req.body[key]);
      }
    }
    if (fields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const [result] = await pool.execute(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      [...params, req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });

    const [rows] = await pool.execute(`SELECT ${COLUMNS} FROM tasks WHERE id = ?`, [req.params.id]);
    res.json({ task: rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const [result] = await pool.execute(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}