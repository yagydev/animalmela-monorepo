import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async ensureThread(buyerId: string, storeId: string) {
    return this.prisma.chatThread.upsert({
      where: { buyerId_storeId: { buyerId, storeId } },
      create: { buyerId, storeId },
      update: {},
    });
  }

  async messages(threadId: string, userId: string) {
    const t = await this.prisma.chatThread.findUnique({
      where: { id: threadId },
      include: { store: { include: { seller: true } } },
    });
    if (!t) throw new NotFoundException();
    const isBuyer = t.buyerId === userId;
    const isSeller = t.store.seller.userId === userId;
    if (!isBuyer && !isSeller) throw new ForbiddenException();
    return this.prisma.chatMessage.findMany({
      where: { threadId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async send(threadId: string, senderId: string, dto: SendMessageDto) {
    await this.messages(threadId, senderId);
    return this.prisma.chatMessage.create({
      data: { threadId, senderId, body: dto.body },
    });
  }
}
