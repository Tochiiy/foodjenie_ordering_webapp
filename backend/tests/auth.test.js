import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
  phoneNumber: '1234567890',
  role: 'user',
  avatar: { public_id: 'default', url: '/images/images.png' },
  getJWTToken: vi.fn().mockReturnValue('mock-jwt-token'),
  correctPassword: vi.fn(),
};

vi.mock('../models/user.js', () => ({
  default: {
    create: vi.fn(),
    findOne: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn(),
    sign: vi.fn().mockReturnValue('mock-jwt-token'),
  },
}));

vi.mock('../utils/sendToken.js', () => ({
  default: vi.fn((user, statusCode, res) => {
    res.status(statusCode).json({
      success: true,
      token: 'mock-jwt-token',
      data: { user },
    });
  }),
}));

vi.mock('../config/cloudinary.js', () => ({
  default: {
    uploader: {
      upload: vi.fn(),
    },
  },
}));

import User from '../models/user.js';

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/users/signup', () => {
    it('should signup a new user successfully', async () => {
      User.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          phoneNumber: '1234567890',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe('mock-jwt-token');
      expect(User.create).toHaveBeenCalledOnce();
    });

    it('should return 400 on missing fields', async () => {
      const validationError = new Error('User validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        name: { message: 'please enter your name' },
        email: { message: 'please enter email id' },
      };
      User.create.mockRejectedValue(validationError);

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({ name: '' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockSelect = vi.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ select: mockSelect });

      mockUser.correctPassword.mockResolvedValue(true);

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe('mock-jwt-token');
    });

    it('should return 401 with wrong credentials', async () => {
      const mockSelect = vi.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ select: mockSelect });

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({ email: 'wrong@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return current authenticated user', async () => {
      User.findById.mockResolvedValue(mockUser);

      const jwt = await import('jsonwebtoken');
      jwt.default.verify.mockReturnValue({ id: mockUser._id });

      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Cookie', ['jwt=mock-jwt-token']);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 without auth cookie', async () => {
      const res = await request(app).get('/api/v1/users/me');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/users/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app).post('/api/v1/users/logout');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Logged out');
    });
  });
});
