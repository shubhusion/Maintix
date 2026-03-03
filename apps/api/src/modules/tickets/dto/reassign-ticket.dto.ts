import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class ReassignTicketDto {
  @IsUUID()
  @IsNotEmpty()
  technicianId: string;

  @IsInt()
  @Min(0)
  version: number;
}
