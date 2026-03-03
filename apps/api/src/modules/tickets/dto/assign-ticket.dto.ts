import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AssignTicketDto {
  @IsUUID()
  @IsNotEmpty()
  technicianId: string;

  @IsInt()
  @Min(0)
  version: number;
}
