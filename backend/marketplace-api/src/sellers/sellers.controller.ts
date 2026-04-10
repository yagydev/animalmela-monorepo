import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { KycDto } from './dto/kyc.dto';
import { SellersService } from './sellers.service';

@ApiTags('sellers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SELLER')
@Controller('sellers')
export class SellersController {
  constructor(private sellers: SellersService) {}

  @Post('onboarding')
  onboarding(@CurrentUser() u: { sub: string }, @Body() dto: KycDto) {
    return this.sellers.startOnboarding(u.sub, dto);
  }

  @Post('me/store')
  createStore(@CurrentUser() u: { sub: string }, @Body() dto: CreateStoreDto) {
    return this.sellers.createStore(u.sub, dto);
  }

  @Get('me')
  me(@CurrentUser() u: { sub: string }) {
    return this.sellers.myStore(u.sub);
  }
}
