import { type NextFunction, type Request, type Response } from 'express';
import zod from 'zod';

const userFields = zod.object({
    name: zod.string().min(3).max(50).trim().toLowerCase(),
    email: zod.email().trim().toLowerCase(),
    password: zod.string(),
    confirm: zod.string(),
});

/* Picked from the unrefined schema: zod refuses .pick() once a refinement is
   attached, and building it once keeps it off the per-request path. */
const passwordFields = userFields.pick({ password: true, confirm: true });

const baseSchema = userFields.refine((data) => data.password === data.confirm, {
    message: 'Password confirmation failed',
    path: ['confirm'],
    when(payload) {
        return passwordFields.safeParse(payload.value).success;
    },
});

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
