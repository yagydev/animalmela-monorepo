import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { KycDto } from './dto/kyc.dto';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async startOnboarding(userId: string, dto: KycDto) {
    const existing = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
    if (existing) {
      return this.prisma.sellerProfile.update({
        where: { userId },
        data: {
          gstNumber: dto.gstNumber,
          panNumber: dto.panNumber,
          kycStatus: 'PENDING',
        },
      });
    }
    return this.prisma.sellerProfile.create({
      data: { userId, gstNumber: dto.gstNumber, panNumber: dto.panNumber },
    });
  }

  async createStore(userId: string, dto: CreateStoreDto) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
    });
    if (!profile)
      throw new BadRequestException('Complete seller onboarding first');
    if (profile.kycStatus !== 'APPROVED') {
      throw new BadRequestException(
        'KYC must be approved before creating a store',
      );
    }
    return this.prisma.store.create({
      data: {
        sellerId: profile.id,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logoUrl: dto.logoUrl,
      },
    });
  }

  async myStore(userId: string) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { store: true },
    });
    if (!profile) throw new NotFoundException('No seller profile');
    return profile;
  }
}
