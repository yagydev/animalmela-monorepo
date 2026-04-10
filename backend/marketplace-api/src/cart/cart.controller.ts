import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/cart-item.dto';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUYER')
@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  get(@CurrentUser() u: { sub: string }) {
    return this.cart.getCart(u.sub);
  }

  @Post('items')
  add(@CurrentUser() u: { sub: string }, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(u.sub, dto);
  }

  @Delete()
  clear(@CurrentUser() u: { sub: string }) {
    return this.cart.clear(u.sub);
  }
}
