import { Router, type IRouter } from 'express';
import createUserValidator from '../validators/create-user.validator.ts';
import { list, create } from '../controllers/users.controller.ts';

const router: IRouter = Router();

router.get('/', list)
router.post('/', createUserValidator, create);

export default router;
