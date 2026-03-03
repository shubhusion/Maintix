import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Plumbing' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;
}
