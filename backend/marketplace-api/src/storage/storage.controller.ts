import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PresignUploadDto } from './dto/presign-upload.dto';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private storage: StorageService) {}

  @Post('presign-product-image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @ApiOperation({
    summary: 'Get S3 presigned PUT URL for a product image (mobile / seller dashboard)',
    description:
      'Client PUTs the file to uploadUrl with header Content-Type matching the request body, then passes publicUrl in CreateProductDto.imageUrls.',
  })
  presign(
    @CurrentUser() u: { sub: string },
    @Body() dto: PresignUploadDto,
  ) {
    return this.storage.presignProductImageUpload(u.sub, dto.contentType);
  }
}
