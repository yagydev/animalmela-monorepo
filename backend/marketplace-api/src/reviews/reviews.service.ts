import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  addProductReview(userId: string, productId: string, dto: ProductReviewDto) {
    return this.prisma.productReview.upsert({
      where: { productId_userId: { productId, userId } },
      create: { productId, userId, rating: dto.rating, comment: dto.comment },
      update: { rating: dto.rating, comment: dto.comment },
    });
  }

  addSellerReview(userId: string, storeId: string, dto: ProductReviewDto) {
    return this.prisma.sellerReview.upsert({
      where: { storeId_userId: { storeId, userId } },
      create: { storeId, userId, rating: dto.rating, comment: dto.comment },
      update: { rating: dto.rating, comment: dto.comment },
    });
  }
}
