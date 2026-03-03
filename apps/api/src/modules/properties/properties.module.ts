import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { MembersController } from './members.controller';

@Module({
  controllers: [PropertiesController, MembersController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
