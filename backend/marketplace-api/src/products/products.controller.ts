import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List approved products (marketplace)' })
  list(@Query() query: ProductQueryDto) {
    return this.products.listPublic(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Category tree (seeded agri categories)' })
  categories() {
    return this.products.categoriesTree();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Product detail' })
  one(@Param('id') id: string) {
    return this.products.getPublic(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER')
  @ApiOperation({ summary: 'Create product (pending admin review)' })
  create(@CurrentUser() u: { sub: string }, @Body() dto: CreateProductDto) {
    return this.products.createForSeller(u.sub, dto);
  }
}
