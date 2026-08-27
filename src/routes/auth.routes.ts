import { Router, type IRouter } from 'express';
import registerValidator from '../validators/auth/register.validator.ts';
import loginValidator from '../validators/auth/login.validator.ts';
import { register, login } from '../controllers/auth.controller.ts';

const router: IRouter = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

export default router;
