import { model, Schema } from 'mongoose';

export interface IUser {
    id: number,
    name: string;
    email: string;
    password: string;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export default model("User", userSchema);
