import { vi, beforeAll, afterAll } from 'vitest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

beforeAll(async () => {
  process.env.NODE_ENV = 'DEVELOPMENT';
});

afterAll(async () => {
  vi.restoreAllMocks();
});
