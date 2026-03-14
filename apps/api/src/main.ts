import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

/**
 * Validate required environment variables
 * Application will not start if required variables are missing
 */
function validateEnvironmentVariables(configService: ConfigService): void {
  const logger = new Logger('EnvironmentValidation');
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredVars) {
    const value = configService.get<string>(envVar);
    if (!value || value.trim() === '') {
      missingVars.push(envVar);
    }
  }

  // Check for default/weak JWT_SECRET
  const jwtSecret = configService.get<string>('JWT_SECRET');
  if (jwtSecret && jwtSecret.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters for security');
  }

  // Check for default JWT_EXPIRES_IN
  const jwtExpiresIn = configService.get<string>('JWT_EXPIRES_IN');
  if (!jwtExpiresIn) {
    warnings.push('JWT_EXPIRES_IN not set, using default "7d"');
  }

  // Log warnings
  for (const warning of warnings) {
    logger.warn(warning);
  }

  // Log missing required variables
  if (missingVars.length > 0) {
    logger.error('❌ Missing required environment variables:');
    for (const envVar of missingVars) {
      logger.error(`  - ${envVar}`);
    }
    
    logger.error('📝 Please set these environment variables:');
    logger.error('');
    logger.error('For Supabase (recommended):');
    logger.error('  DATABASE_URL="postgresql://postgres.[PROJECT]:[PASS]@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true"');
    logger.error('  JWT_SECRET="your-super-secret-key-min-32-characters-long"');
    logger.error('');
    logger.error('For local development:');
    logger.error('  DATABASE_URL="postgresql://postgres:password@localhost:5432/maintix"');
    logger.error('  JWT_SECRET="dev-secret-key-at-least-32-characters-long"');
    logger.error('');
    logger.error('📚 See docs/supabase-docker-cloudrun.md for complete setup guide');
    logger.error('');
    
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Application cannot start without these variables.'
    );
  }

  // Log successful validation
  logger.log('✅ Environment variables validated successfully');
  logger.log(`📊 Database: ${configService.get<string>('DATABASE_URL', '').includes('supabase') ? 'Supabase' : 'PostgreSQL'}`);
  logger.log(`🔐 JWT Expires: ${configService.get<string>('JWT_EXPIRES_IN', '7d')}`);
  logger.log(`🌍 Environment: ${configService.get<string>('NODE_ENV', 'development')}`);
  logger.log(`🔓 CORS Origin: ${configService.get<string>('CORS_ORIGIN', '*')}`);
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validate environment variables BEFORE anything else
  validateEnvironmentVariables(configService);

  // Security headers
  app.use(helmet());

  // CORS - Allow both with and without trailing slash
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const corsOrigins = [
    corsOrigin,
    corsOrigin.replace(/\/$/, ''), // Without trailing slash
    corsOrigin.replace(/\/?$/, '/'), // With trailing slash
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Maintix API')
    .setDescription('Multi-Property Maintenance Workflow Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  logger.log(`🚀 Maintix API running on http://localhost:${port}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
  logger.log(`🗄️  Database: ${configService.get<string>('DATABASE_URL', '').includes('supabase') ? 'Supabase' : 'PostgreSQL'}`);
}

bootstrap();
