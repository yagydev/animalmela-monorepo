import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto, ProductSort } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async categoriesTree() {
    const all = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    const roots = all.filter((c) => !c.parentId);
    const childrenOf = (id: string) => all.filter((c) => c.parentId === id);
    return roots.map((r) => ({ ...r, children: childrenOf(r.id) }));
  }

  async listPublic(q: ProductQueryDto) {
    const page = q.page ?? 1;
    const limit = q.limit ?? 20;
    const where: Prisma.ProductWhereInput = { status: 'APPROVED' };
    if (q.categoryId) where.categoryId = q.categoryId;
    if (q.state) where.state = q.state;
    if (q.district) where.district = q.district;
    if (q.minPrice != null || q.maxPrice != null) {
      where.price = {};
      if (q.minPrice != null) where.price.gte = q.minPrice;
      if (q.maxPrice != null) where.price.lte = q.maxPrice;
    }
    if (q.q) {
      where.OR = [
        { title: { contains: q.q, mode: 'insensitive' } },
        { description: { contains: q.q, mode: 'insensitive' } },
      ];
    }
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (q.sort === ProductSort.latest) orderBy = { createdAt: 'desc' };
    if (q.sort === ProductSort.price_asc) orderBy = { price: 'asc' };
    if (q.sort === ProductSort.price_desc) orderBy = { price: 'desc' };
    if (q.sort === ProductSort.popularity)
      orderBy = { reviews: { _count: 'desc' } };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { images: true, store: true, category: true },
      }),
      this.prisma.product.count({ where }),
    ]);
    return { items, total, page, limit };
  }

  async getPublic(id: string) {
    const p = await this.prisma.product.findFirst({
      where: { id, status: 'APPROVED' },
      include: {
        images: true,
        store: true,
        category: true,
        reviews: { include: { user: { select: { name: true } } } },
      },
    });
    if (!p) throw new NotFoundException();
    return p;
  }

  async createForSeller(userId: string, dto: CreateProductDto) {
    const profile = await this.prisma.sellerProfile.findUnique({
      where: { userId },
      include: { store: true },
    });
    if (!profile?.store) throw new ForbiddenException('Store required');
    const product = await this.prisma.product.create({
      data: {
        storeId: profile.store.id,
        categoryId: dto.categoryId,
        title: dto.title,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock ?? 0,
        sku: dto.sku,
        state: dto.state,
        district: dto.district,
        status: 'PENDING_REVIEW',
        images: {
          create: (dto.imageUrls ?? []).map((url, i) => ({
            url,
            sortOrder: i,
          })),
        },
      },
      include: { images: true },
    });
    return product;
  }
}
