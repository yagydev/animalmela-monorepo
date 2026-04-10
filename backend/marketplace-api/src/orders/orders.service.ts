import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
    });
    if (!address) throw new NotFoundException('Address');

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
    if (!cart?.items.length) throw new BadRequestException('Cart empty');

    let subtotal = 0;
    for (const line of cart.items) {
      subtotal += Number(line.priceSnapshot) * line.quantity;
    }
    const platformFee = 0;
    const total = subtotal + platformFee;

    const addressSnapshot = {
      line1: address.line1,
      line2: address.line2,
      district: address.district,
      state: address.state,
      pincode: address.pincode,
    };

    const order = await this.prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          subtotal,
          platformFee,
          total,
          addressSnapshot,
          paymentStatus: 'PENDING',
          status: 'PLACED',
          items: {
            create: cart.items.map((ci) => ({
              productId: ci.productId,
              storeId: ci.product.storeId,
              quantity: ci.quantity,
              unitPrice: ci.priceSnapshot,
              titleSnapshot: ci.product.title,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of o.items) {
        const store = await tx.store.findUnique({
          where: { id: item.storeId },
        });
        if (store) {
          const rate = Number(store.commissionRate);
          const amount = Number(item.unitPrice) * item.quantity * rate;
          await tx.commissionLedger.create({
            data: { orderId: o.id, storeId: item.storeId, amount, rate },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return o;
    });

    return {
      order,
      razorpay: { note: 'Use POST /payments/razorpay/order with orderId' },
    };
  }

  async listMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async updateStatus(
    orderId: string,
    status: 'PLACED' | 'PACKED' | 'SHIPPED' | 'DELIVERED',
    trackingId?: string,
  ) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status, trackingId: trackingId ?? undefined },
    });
  }
}
