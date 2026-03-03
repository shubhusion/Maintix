import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Sunrise Apartments' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '123 Main St, City, State 12345' })
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  address: string;

  @ApiPropertyOptional({ example: 'A modern apartment complex' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
