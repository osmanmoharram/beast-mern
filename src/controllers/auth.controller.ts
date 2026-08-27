import { type Request, type Response } from 'express';
import User from '../models/user.model.ts';
import { UserController } from './users.controller.ts';
import jwt from 'jsonwebtoken';
import env from '../bootstrap/env.ts';

type ReqParams = Record<string, unknown>;
type ResBody = Record<string, unknown>;
type ReqBody = {
    name: string;
    email: string;
    password: string;
};

export const register = async (req: Request<ReqParams, ResBody, ReqBody>, res: Response) => {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
        return res.json('There is already an account by this email');
    }

    const user = await UserController.create(req);

    const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecretKey);

    return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
};
