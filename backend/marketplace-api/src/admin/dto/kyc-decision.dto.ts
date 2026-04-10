import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class KycDecisionDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'PENDING'] })
  @IsEnum(['APPROVED', 'REJECTED', 'PENDING'] as const)
  status!: 'APPROVED' | 'REJECTED' | 'PENDING';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
