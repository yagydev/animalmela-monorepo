import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './jwt.strategy';

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async sendOtp(phone: string) {
    const devCode = this.config.get<string>('OTP_DEV_CODE');
    const code = devCode || String(randomInt(100000, 999999));
    const codeHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.prisma.otpChallenge.create({
      data: { phone, codeHash, expiresAt },
    });

    if (devCode) {
      console.log(`[OTP] dev fixed code for ${phone}: ${devCode}`);
    } else {
      console.log(`[OTP] ${phone} code=${code} (do not log in production)`);
    }

    return {
      ok: true,
      message: 'OTP sent',
      devHint: devCode ? 'Using OTP_DEV_CODE' : undefined,
    };
  }

  async verifyOtp(phone: string, code: string, role?: Role) {
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { phone },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge || challenge.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired or missing');
    }
    if (challenge.attempts >= MAX_OTP_ATTEMPTS) {
      throw new UnauthorizedException('Too many attempts');
    }
    const ok = await bcrypt.compare(code, challenge.codeHash);
    await this.prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    if (!ok) {
      throw new UnauthorizedException('Invalid OTP');
    }

    let user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await this.prisma.user.create({
        data: { phone, role: role ?? 'BUYER' },
      });
    } else if (role && user.role === 'BUYER' && role !== 'BUYER') {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { role },
      });
    }

    const payload: JwtPayload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };
    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: { id: user.id, phone: user.phone, role: user.role },
    };
  }

  async promoteSeller(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: 'SELLER' },
    });
  }
}
