import 'dotenv/config';
import zod, { type ZodSafeParseResult } from 'zod';

const envSchema = zod.object({
    appName: zod.string().min(3).max(50),
    nodeEnv: zod.enum(['local', 'stagging', 'production']),
    port: zod.number().positive().default(3000),
    mongodbURL: zod.string(),
    jwtSecretKey: zod.hash('sha256', { enc: 'base64' }),
    jwtExpiresIn: zod.string().max(3),
});

type EnvOptions = zod.infer<typeof envSchema>;

const validated: ZodSafeParseResult<EnvOptions> = envSchema.safeParse({
    appName: process.env.APP_NAME,
    nodeEnv: process.env.NODE_ENV,
    port: Number(process.env.PORT),
    mongodbURL: process.env.MONGODB_URL,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
});

if (!validated.success) {
    console.log(validated.error);
    process.exit(1);
}

const env = validated.data;

export default env;
