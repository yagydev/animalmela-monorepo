import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private razorpay: Razorpay | null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const id = config.get<string>('RAZORPAY_KEY_ID');
    const secret = config.get<string>('RAZORPAY_KEY_SECRET');
    this.razorpay =
      id && secret ? new Razorpay({ key_id: id, key_secret: secret }) : null;
  }

  async createRazorpayOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order');
    const amountPaise = Math.round(Number(order.total) * 100);

    if (!this.razorpay) {
      return {
        mock: true,
        orderId: order.id,
        amountPaise,
        message: 'Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for live orders',
      };
    }

    const rz = await this.razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: order.id,
      notes: { internalOrderId: order.id },
    });

    await this.prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: rz.id },
    });

    return { mock: false, razorpayOrder: rz };
  }

  async markPaid(orderId: string, paymentId: string) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: 'PAID', razorpayPaymentId: paymentId },
    });
  }
}
