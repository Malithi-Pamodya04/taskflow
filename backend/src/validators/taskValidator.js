import { body, param, query } from 'express-validator';

const PRIORITIES = ['low', 'medium', 'high'];
const STATUSES = ['todo', 'in_progress', 'completed'];

export const idParam = [
  param('id').isInt({ min: 1 }).withMessage('Task id must be a positive integer'),
];

export const createTaskRules = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 150 }).withMessage('Title must be 150 characters or fewer'),
  body('description').optional({ values: 'null' }).isString().isLength({ max: 2000 })
    .withMessage('Description must be 2000 characters or fewer'),
  body('priority').optional().isIn(PRIORITIES).withMessage('Priority must be low, medium or high'),
  body('status').optional().isIn(STATUSES).withMessage('Status must be todo, in_progress or completed'),
  body('deadline').optional({ values: 'null' }).isISO8601({ strict: true })
    .withMessage('Deadline must be a valid date (YYYY-MM-DD)'),
];

// For updates every field is optional, but any provided field must be valid.
export const updateTaskRules = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')
    .isLength({ max: 150 }).withMessage('Title must be 150 characters or fewer'),
  body('description').optional({ values: 'null' }).isString().isLength({ max: 2000 })
    .withMessage('Description must be 2000 characters or fewer'),
  body('priority').optional().isIn(PRIORITIES).withMessage('Priority must be low, medium or high'),
  body('status').optional().isIn(STATUSES).withMessage('Status must be todo, in_progress or completed'),
  body('deadline').optional({ values: 'null' }).isISO8601({ strict: true })
    .withMessage('Deadline must be a valid date (YYYY-MM-DD)'),
];

export const listTaskRules = [
  query('status').optional().isIn(STATUSES).withMessage('Invalid status filter'),
  query('priority').optional().isIn(PRIORITIES).withMessage('Invalid priority filter'),
  query('sort').optional().isIn(['deadline', 'created']).withMessage('Sort must be deadline or created'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc'),
  query('search').optional().isString().isLength({ max: 150 }),
];