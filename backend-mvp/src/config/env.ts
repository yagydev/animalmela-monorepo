import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5050),
  jwtSecret: process.env.JWT_SECRET ?? 'dev-jwt-secret',
  dbUrl:
    process.env.DATABASE_URL ??
    'postgres://postgres:postgres@localhost:5432/kisaanmela_mvp'
};
