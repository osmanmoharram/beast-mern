import { Router } from 'express';
import authRoutes from './auth.routes.ts';
import usersRoutes from './users.routes.ts';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);

export default router;
