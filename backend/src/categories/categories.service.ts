import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: { ...dto, parentId: dto.parentId ?? null, slug: slugify(dto.name) },
    });
  }

  async findAll() {
    // MongoDB stores `parentId` as absent (not `null`) on categories created without one,
    // and Prisma's `where: { parentId: null }` filter only matches an explicit null —
    // so top-level categories are filtered in-memory instead of at the query level.
    const categories = await this.prisma.category.findMany({
      include: { children: true },
      orderBy: { name: 'asc' },
    });
    return categories.filter((category) => !category.parentId);
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    });
    if (!category) throw new NotFoundException('Catégorie introuvable.');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.category.delete({ where: { id } });
  }
}
