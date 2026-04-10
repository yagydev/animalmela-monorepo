import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

const ALLOWED = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

export class PresignUploadDto {
  @ApiProperty({
    example: 'image/jpeg',
    enum: ALLOWED,
    description: 'MIME type of the file the client will upload with PUT',
  })
  @IsString()
  @IsIn([...ALLOWED])
  contentType!: (typeof ALLOWED)[number];
}
