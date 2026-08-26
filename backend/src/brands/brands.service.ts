import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBrandDto, UpdateBrandDto } from './dto/brand.dto';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBrandDto) {
    return this.prisma.brand.create({ data: { ...dto, slug: slugify(dto.name) } });
  }

  findAll() {
    return this.prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id }, include: { models: true } });
    if (!brand) throw new NotFoundException('Marque introuvable.');
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto) {
    await this.findOne(id);
    return this.prisma.brand.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.brand.update({ where: { id }, data: { isActive: false } });
  }
}
