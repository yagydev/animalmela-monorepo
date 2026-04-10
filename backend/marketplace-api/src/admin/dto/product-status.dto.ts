import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class ProductStatusDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED', 'PENDING_REVIEW', 'DRAFT'] })
  @IsEnum(['APPROVED', 'REJECTED', 'PENDING_REVIEW', 'DRAFT'] as const)
  status!: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW' | 'DRAFT';
}
