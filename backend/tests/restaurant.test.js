import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const mockRestaurant = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test Restaurant',
  address: '123 Test St',
  isVeg: false,
  ratings: 4.5,
  numOfReviews: 10,
  location: {
    type: 'Point',
    coordinates: [72.8777, 19.076],
  },
  reviews: [],
  images: [],
};

const mockRestaurantList = [
  mockRestaurant,
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Second Restaurant',
    address: '456 Other St',
    isVeg: true,
    ratings: 4.0,
    numOfReviews: 5,
    location: {
      type: 'Point',
      coordinates: [72.8777, 19.076],
    },
    reviews: [],
    images: [],
  },
];

vi.mock('../models/restaurant.js', () => ({
  default: {
    create: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
  },
}));

vi.mock('../utils/apiFeatures.js', () => ({
  default: vi.fn().mockImplementation((query) => ({
    search: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    filter: vi.fn().mockReturnThis(),
    pagination: vi.fn().mockReturnThis(),
    query,
  })),
}));

import Restaurant from '../models/restaurant.js';

describe('Restaurant Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/eats/stores', () => {
    it('should return all restaurants', async () => {
      const mockQuery = {
        find: vi.fn().mockReturnThis(),
      };
      Restaurant.find.mockReturnValue(mockQuery);
      const execMock = vi.fn().mockResolvedValue(mockRestaurantList);
      mockQuery.find = vi.fn().mockReturnValue({ ...mockQuery, _exec: execMock });

      Restaurant.find.mockReturnValue({
        sort: vi.fn().mockReturnThis(),
        _exec: execMock,
      });

      const apiFeaturesMock = await import('../utils/apiFeatures.js');
      apiFeaturesMock.default.mockImplementation((query) => ({
        search: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        query: mockRestaurantList,
      }));

      const res = await request(app).get('/api/v1/eats/stores');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Success');
      expect(res.body.count).toBe(2);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/v1/eats/stores/:storeId', () => {
    it('should return a restaurant by ID', async () => {
      Restaurant.findById.mockResolvedValue(mockRestaurant);

      const res = await request(app).get(`/api/v1/eats/stores/${mockRestaurant._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Success');
      expect(res.body.data.name).toBe('Test Restaurant');
    });

    it('should return 404 for non-existent restaurant', async () => {
      Restaurant.findById.mockResolvedValue(null);

      const res = await request(app).get('/api/v1/eats/stores/507f1f77bcf86cd799439099');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/eats/stores', () => {
    it('should create a new restaurant', async () => {
      Restaurant.create.mockResolvedValue(mockRestaurant);

      const res = await request(app)
        .post('/api/v1/eats/stores')
        .send({
          name: 'Test Restaurant',
          address: '123 Test St',
          location: {
            type: 'Point',
            coordinates: [72.8777, 19.076],
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('Success');
      expect(res.body.data.name).toBe('Test Restaurant');
    });

    it('should return 400 on validation error', async () => {
      const validationError = new Error('Restaurant validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = {
        name: { message: 'Please enter the restaurant name' },
      };
      Restaurant.create.mockRejectedValue(validationError);

      const res = await request(app)
        .post('/api/v1/eats/stores')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
