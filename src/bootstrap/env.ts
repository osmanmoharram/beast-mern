import 'dotenv/config';
import zod, { type ZodSafeParseResult } from 'zod';

const envSchema = zod.object({
    appName: zod.string().min(3).max(50),
    nodeEnv: zod.enum(['local', 'stagging', 'production']),
    port: zod.number().positive().default(3000),
    mongodbURL: zod.string(),
});

type EnvOptions = {
    appName: string,
    nodeEnv: string,
    port: number,
    mongodbURL: string
}

const validated: ZodSafeParseResult<EnvOptions> = envSchema.safeParse({
    appName: process.env.APP_NAME,
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    mongodbURL: process.env.MONGODB_URL,
});

if (!validated.success) {
    console.log(validated.error);
    process.exit(1);
}

const env = validated.data;

export default env;
