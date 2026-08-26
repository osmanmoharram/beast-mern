import mongoose from 'mongoose';
import env from './env.ts';

export default async function connectToDatabase() {
    try {
        await mongoose.connect(env.mongodbURL);
    } catch {
        console.log('Could not connect to database');
        process.exit(1);
    }
}
