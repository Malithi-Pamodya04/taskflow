import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createTask, getTasks, getTask, updateTask, deleteTask,
} from '../controllers/taskController.js';
import {
  idParam, createTaskRules, updateTaskRules, listTaskRules,
} from '../validators/taskValidator.js';

const router = Router();

router.use(protect); // every task route requires a valid token

router.route('/')
  .get(listTaskRules, validate, getTasks)
  .post(createTaskRules, validate, createTask);

router.route('/:id')
  .get(idParam, validate, getTask)
  .put(idParam, updateTaskRules, validate, updateTask)
  .delete(idParam, validate, deleteTask);

export default router;