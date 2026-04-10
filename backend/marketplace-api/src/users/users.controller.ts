import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateAddressDto } from './dto/address.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  me(@CurrentUser() u: { sub: string }) {
    return this.users.getProfile(u.sub);
  }

  @Patch('me')
  updateMe(@CurrentUser() u: { sub: string }, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(u.sub, dto);
  }

  @Get('me/addresses')
  addresses(@CurrentUser() u: { sub: string }) {
    return this.users.listAddresses(u.sub);
  }

  @Post('me/addresses')
  addAddress(@CurrentUser() u: { sub: string }, @Body() dto: CreateAddressDto) {
    return this.users.addAddress(u.sub, dto);
  }
}
