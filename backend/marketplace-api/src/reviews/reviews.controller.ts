import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ProductReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUYER')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post('products/:productId')
  product(
    @CurrentUser() u: { sub: string },
    @Param('productId') productId: string,
    @Body() dto: ProductReviewDto,
  ) {
    return this.reviews.addProductReview(u.sub, productId, dto);
  }

  @Post('stores/:storeId')
  store(
    @CurrentUser() u: { sub: string },
    @Param('storeId') storeId: string,
    @Body() dto: ProductReviewDto,
  ) {
    return this.reviews.addSellerReview(u.sub, storeId, dto);
  }
}
