import { type Request, type Response } from 'express';
import env from '../bootstrap/env.ts';
import User from '../models/user.model.ts';
import { UserController } from './users.controller.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

type ReqParams = Record<string, unknown>;
type ResBody = Record<string, unknown>;
type ReqBody = {
    email: string;
    password: string;
};

export const register = async (
    req: Request<ReqParams, ResBody, ReqBody & { name: string }>,
    res: Response,
) => {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
        return res.json('There is already an account by this email');
    }

    const user = await UserController.create(req);

    const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecretKey, {
        expiresIn: 60 * 60,
    });

    return res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
};

export const login = async (req: Request<ReqParams, ResBody, ReqBody>, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return res.json('Invalid email or password');
    }

    const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecretKey, {
        expiresIn: 60 * 60,
    });

    return res.status(200).json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
};
