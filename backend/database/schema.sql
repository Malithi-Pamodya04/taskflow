CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE taskflow;

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(150) NOT NULL,
  description TEXT NULL,
  priority    ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
  status      ENUM('todo', 'in_progress', 'completed') NOT NULL DEFAULT 'todo',
  deadline    DATE NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tasks_user_status (user_id, status),
  INDEX idx_tasks_deadline (deadline)
) ENGINE=InnoDB