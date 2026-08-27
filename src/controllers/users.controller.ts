import { type Request, type Response } from 'express';
import User, { type IUser } from '../models/user.model.ts';
import bcrypt from 'bcrypt';

type ReqParams = Record<string, unknown>;
type ResBody = Record<string, unknown>;
type ReqBody = {
    name: string;
    email: string;
    password: string;
};

export class UserController {
    // static async list(req: Request, res: Response): Promise<IUser[]> {
    //     // const users = await User.find();

    //     // return res.json({ users });
    // }

    static async create(req: Request<ReqParams, ResBody, ReqBody>): Promise<IUser> {
        return await User.create({
            ...req.body,
            password: await bcrypt.hash(req.body.password, 10),
        });
    }
}
