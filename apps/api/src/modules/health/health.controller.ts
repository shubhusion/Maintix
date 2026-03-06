import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '@/common/database/prisma.service';
import { Public } from '@/common/decorators';
import { STORAGE_BUCKET } from '@maintix/shared-types';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.supabase = createClient(
      this.config.getOrThrow('SUPABASE_URL'),
      this.config.getOrThrow('SUPABASE_SERVICE_KEY'),
    );
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async check() {
    const [database, storage] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkStorage(),
    ]);

    const dbOk = database.status === 'fulfilled' && database.value;
    const storageOk = storage.status === 'fulfilled' && storage.value;
    const allHealthy = dbOk && storageOk;

    return {
      status: allHealthy ? 'ok' : 'degraded',
      database: dbOk ? 'connected' : 'disconnected',
      storage: storageOk ? 'connected' : 'disconnected',
    };
  }

  private async checkDatabase(): Promise<boolean> {
    await this.prisma.$queryRaw`SELECT 1`;
    return true;
  }

  private async checkStorage(): Promise<boolean> {
    const { error } = await this.supabase.storage.from(STORAGE_BUCKET).list('', { limit: 1 });
    return !error;
  }
}
