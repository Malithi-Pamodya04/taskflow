import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getStats } from '../controllers/dashboardController.js';

const router = Router();

router.get('/stats', protect, getStats);

export default router;