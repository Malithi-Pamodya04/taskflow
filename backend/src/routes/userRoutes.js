import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { listUsers } from '../controllers/userController.js';

const router = Router();

router.get('/', protect, authorize('admin'), listUsers);

export default router;