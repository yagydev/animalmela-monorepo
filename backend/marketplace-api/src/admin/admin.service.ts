import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  summary() {
    return Promise.all([
      this.prisma.user.count(),
      this.prisma.sellerProfile.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
    ]).then(([users, sellers, products, orders]) => ({
      users,
      sellers,
      products,
      orders,
    }));
  }

  setKyc(
    userId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING',
    notes?: string,
  ) {
    return this.prisma.sellerProfile.update({
      where: { userId },
      data: { kycStatus: status, kycNotes: notes },
    });
  }

  setProductStatus(
    productId: string,
    status: 'APPROVED' | 'REJECTED' | 'PENDING_REVIEW' | 'DRAFT',
  ) {
    return this.prisma.product.update({
      where: { id: productId },
      data: { status },
    });
  }

  pendingProducts() {
    return this.prisma.product.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: { store: true, category: true },
    });
  }
}
