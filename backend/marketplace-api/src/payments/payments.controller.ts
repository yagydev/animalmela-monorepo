import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PaymentsService } from './payments.service';

class MarkPaidDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentId?: string;
}

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('razorpay/order/:orderId')
  @Roles('BUYER')
  createRz(@Param('orderId') orderId: string) {
    return this.payments.createRazorpayOrder(orderId);
  }

  @Post('razorpay/mock-complete/:orderId')
  @Roles('BUYER', 'ADMIN')
  mockComplete(@Param('orderId') orderId: string, @Body() body: MarkPaidDto) {
    return this.payments.markPaid(orderId, body.paymentId || 'mock_pay');
  }
}
