import 'dotenv/config';
import app from './src/app.js';
import { pool } from './src/config/db.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MySQL:', err.message);
    process.exit(1);
  }
}

start();