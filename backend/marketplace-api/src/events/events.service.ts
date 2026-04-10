import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  listPublished() {
    return this.prisma.agriEvent.findMany({
      where: { isPublished: true },
      orderBy: { startsAt: 'asc' },
    });
  }

  create(dto: CreateEventDto) {
    return this.prisma.agriEvent.create({ data: dto });
  }
}
