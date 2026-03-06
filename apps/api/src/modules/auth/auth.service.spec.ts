import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '@/common/database/prisma.service';
import { BusinessException } from '@/common/exceptions/business.exception';
import { ErrorCode } from '@maintix/shared-types';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock } };
  let jwtService: { sign: jest.Mock };

  const mockUser = {
    id: 'user-1',
    email: 'admin@maintix.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'MANAGER',
    passwordHash: 'hashed-password',
    isActive: true,
    deletedAt: null,
  };

  beforeEach(async () => {
    prisma = { user: { findUnique: jest.fn() } };
    jwtService = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return accessToken and user on valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login({
        email: 'admin@maintix.com',
        password: 'password123',
      });

      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          role: mockUser.role,
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw INVALID_CREDENTIALS when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      try {
        await service.login({ email: 'nonexistent@test.com', password: 'password' });
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        const response = (e as BusinessException).getResponse() as Record<string, unknown>;
        expect(response.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS);
      }
    });

    it('should throw USER_INACTIVE when user is deactivated', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, isActive: false });

      try {
        await service.login({ email: mockUser.email, password: 'password' });
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        const response = (e as BusinessException).getResponse() as Record<string, unknown>;
        expect(response.errorCode).toBe(ErrorCode.USER_INACTIVE);
      }
    });

    it('should throw INVALID_CREDENTIALS when password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      try {
        await service.login({ email: mockUser.email, password: 'wrong-password' });
        fail('Expected BusinessException');
      } catch (e) {
        expect(e).toBeInstanceOf(BusinessException);
        const response = (e as BusinessException).getResponse() as Record<string, unknown>;
        expect(response.errorCode).toBe(ErrorCode.INVALID_CREDENTIALS);
      }
    });

    it('should query for non-deleted users only', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      try {
        await service.login({ email: 'test@test.com', password: 'password' });
      } catch {
        // expected
      }

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com', deletedAt: null },
      });
    });
  });
});
