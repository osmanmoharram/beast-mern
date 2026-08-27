import type { IUser } from "../models/user.model.ts"

type jwtPayload = {
    sub: IUser['id'] 
    email: IUser['email']
}