import { type Request, type Response } from 'express';
import User from '../models/user.model.ts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../bootstrap/env.ts';

type ReqParams = Record<string, unknown>;
type ResBody = Record<string, unknown>;
type ReqBody = {
    name: string;
    email: string;
    password: string;
};

export const list = async (req: Request, res: Response) => {
    const users = await User.find();

    return res.json({ users });
};

export const create = async (req: Request<ReqParams, ResBody, ReqBody>, res: Response) => {
    const exists = await User.findOne({ email: req.body.email });

    if (exists) {
        return res.json('There is already an account by this email');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
        ...req.body,
        password: hashedPassword,
    });

    const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecretKey);

    return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
    });
};
