import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateModelDto, UpdateModelDto } from './dto/model.dto';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

@Injectable()
export class ModelsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateModelDto) {
    return this.prisma.model.create({ data: { ...dto, slug: slugify(dto.name) } });
  }

  findByBrand(brandId: string) {
    return this.prisma.model.findMany({ where: { brandId }, orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const model = await this.prisma.model.findUnique({ where: { id }, include: { brand: true } });
    if (!model) throw new NotFoundException('Modèle introuvable.');
    return model;
  }

  async update(id: string, dto: UpdateModelDto) {
    await this.findOne(id);
    return this.prisma.model.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.model.delete({ where: { id } });
  }
}
