import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * E2E tests for Auth endpoints.
 * Requires a running database — set DATABASE_URL in .env or .env.test.
 * Run: pnpm --filter @maintix/api test:e2e
 */
describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/v1/auth/login', () => {
    it('should return 401 with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'wrongpassword' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should return 400 with invalid email format', () => {
      return request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'not-an-email', password: 'password123' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Protected routes', () => {
    it('should return 401 for protected endpoint without token', () => {
      return request(app.getHttpServer()).get('/api/v1/properties').expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 401 with an invalid JWT', () => {
      return request(app.getHttpServer())
        .get('/api/v1/properties')
        .set('Authorization', 'Bearer invalid.jwt.token')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Health check', () => {
    it('should return 200 on health endpoint', () => {
      return request(app.getHttpServer()).get('/api/v1/health').expect(HttpStatus.OK);
    });
  });
});
