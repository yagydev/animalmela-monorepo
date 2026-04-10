import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post('checkout')
  @Roles('BUYER')
  checkout(@CurrentUser() u: { sub: string }, @Body() dto: CheckoutDto) {
    return this.orders.checkout(u.sub, dto);
  }

  @Get('me')
  @Roles('BUYER')
  mine(@CurrentUser() u: { sub: string }) {
    return this.orders.listMine(u.sub);
  }
}
