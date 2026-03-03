import { IsEnum, IsInt, Min } from 'class-validator';
import { Priority } from '@maintix/shared-types';

export class UpdatePriorityDto {
  @IsEnum(Priority)
  priority: Priority;

  @IsInt()
  @Min(0)
  version: number;
}
