import { IsInt, Min } from 'class-validator';

export class TransitionVersionDto {
  @IsInt()
  @Min(0)
  version: number;
}
