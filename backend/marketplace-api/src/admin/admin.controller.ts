import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { KycDecisionDto } from './dto/kyc-decision.dto';
import { ProductStatusDto } from './dto/product-status.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('summary')
  summary() {
    return this.admin.summary();
  }

  @Get('products/pending')
  pendingProducts() {
    return this.admin.pendingProducts();
  }

  @Patch('sellers/:userId/kyc')
  kyc(@Param('userId') userId: string, @Body() dto: KycDecisionDto) {
    return this.admin.setKyc(userId, dto.status, dto.notes);
  }

  @Patch('products/:id/status')
  productStatus(@Param('id') id: string, @Body() dto: ProductStatusDto) {
    return this.admin.setProductStatus(id, dto.status);
  }
}
