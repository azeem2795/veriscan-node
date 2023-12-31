import { config as envConfig } from 'dotenv';
envConfig({ path: '.env' });

export const APP_NAME = process.env.APP_NAME ?? 'NodeJS TypeScript Boilerplate';
export const NODE_ENV = process.env.NODE_ENV ?? 'dev';
export const PORT = process.env.PORT ?? 5000;
export const MONGODB_URI =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nodejs-boilerplate';
export const MAILER_HOST = process.env.MAILER_HOST ?? 'smtp.office365.com';
export const MAILER_PORT = process.env.MAILER_PORT ?? '587';
export const MAILER_DOMAIN = process.env.MAILER_DOMAIN ?? 'VeriScan';
export const MAILER_EMAIL = process.env.MAILER_EMAIL ?? 'noreply@getveriscan.com';
export const MAILER_PASSWORD = process.env.MAILER_PASSWORD ?? 'z2&E8uTv%YN&R!^WH@';
export const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT ?? '10');
export const COOKIE_SECRET = process.env.COOKIE_SECRET ?? 'secret';
export const JWT_SECRET = process.env.JWT_SECRET ?? 'secret';
export const HOST = process.env.HOST ?? 'http://localhost:5000';
export const ORIGIN = process.env.ORIGIN ?? 'http://localhost:3000';
export const ADMIN = process.env.ADMIN ?? 'http://localhost:3001';
export const CLIENT = process.env.CLIENT ?? process.env.ADMIN ?? 'http://localhost:3001';
