import { Router, type IRouter } from 'express';
import registerValidator from '../validators/auth/register.validator.ts';
import { register } from '../controllers/auth.controller.ts';

const router: IRouter = Router();

router.post('/register', registerValidator, register);

export default router;
