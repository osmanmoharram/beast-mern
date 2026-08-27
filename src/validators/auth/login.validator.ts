import { type NextFunction, type Request, type Response } from 'express';
import zod from 'zod';
import { userFields } from './register.validator.ts';

const baseSchema = userFields.pick({ email: true, password: true });

export default function (req: Request, res: Response, next: NextFunction) {
    const validated = baseSchema.safeParse(req.body);

    if (!validated.success) {
        return res.status(400).json({
            errors: zod.flattenError(validated.error).fieldErrors,
        });
    }

    req.body = validated.data;

    next();
}
