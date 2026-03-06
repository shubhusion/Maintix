import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from '../src/app.module';

/**
 * E2E tests for Ticket endpoints.
 * Requires a running database with seeded data — set DATABASE_URL in .env or .env.test.
 * Run: pnpm --filter @maintix/api test:e2e
 */
describe('Tickets (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

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

    jwtService = app.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  function makeToken(payload: { sub: string; email: string; role: string }) {
    return jwtService.sign(payload);
  }

  describe('GET /api/v1/tickets/:id', () => {
    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tickets/00000000-0000-0000-0000-000000000000')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 404 for non-existent ticket', () => {
      const token = makeToken({
        sub: '00000000-0000-0000-0000-000000000001',
        email: 'test@maintix.com',
        role: 'MANAGER',
      });

      return request(app.getHttpServer())
        .get('/api/v1/tickets/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('POST /api/v1/properties/:propertyId/tickets', () => {
    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/api/v1/properties/00000000-0000-0000-0000-000000000000/tickets')
        .send({
          title: 'Test',
          description: 'Test description',
          categoryId: '00000000-0000-0000-0000-000000000000',
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return 400 with invalid body', () => {
      const token = makeToken({
        sub: '00000000-0000-0000-0000-000000000001',
        email: 'test@maintix.com',
        role: 'MANAGER',
      });

      return request(app.getHttpServer())
        .post('/api/v1/properties/00000000-0000-0000-0000-000000000000/tickets')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('PATCH /api/v1/tickets/:id/assign', () => {
    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/tickets/00000000-0000-0000-0000-000000000000/assign')
        .send({ technicianId: '00000000-0000-0000-0000-000000000001', version: 1 })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('PATCH /api/v1/tickets/:id/cancel', () => {
    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/tickets/00000000-0000-0000-0000-000000000000/cancel')
        .send({ reason: 'test', version: 1 })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
