import express, { type Express } from 'express';
import connectToDatabase from './database.ts';
import cors from 'cors';
import helmet from 'helmet';
import router from '../routes/index.routes.ts';

await connectToDatabase();

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(router);

export default app;
