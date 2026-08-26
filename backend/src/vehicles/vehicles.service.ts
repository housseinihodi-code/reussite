import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, VehicleStatus } from '@prisma/client';
import { nanoid } from 'nanoid';
import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedResult } from '@/common/dto/pagination.dto';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryVehicleDto } from './dto/query-vehicle.dto';

const DIACRITICS_REGEX = new RegExp('[̀-ͯ]', 'g');

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS_REGEX, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertVinAvailable(vin: string | undefined, excludeId?: string) {
    if (!vin) return;
    const existing = await this.prisma.vehicle.findFirst({ where: { vin } });
    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Ce numéro VIN est déjà utilisé par une autre annonce.');
    }
  }

  async create(sellerId: string, dto: CreateVehicleDto, isAdmin = false) {
    await this.assertVinAvailable(dto.vin);
    const { imageUrls, ...data } = dto;
    const slug = `${slugify(dto.title)}-${nanoid(6)}`;

    return this.prisma.vehicle.create({
      data: {
        ...data,
        slug,
        sellerId,
        // Admins act as their own moderators, so their listings go live immediately.
        status: isAdmin ? VehicleStatus.PUBLISHED : VehicleStatus.PENDING_REVIEW,
        images: imageUrls?.length
          ? {
              create: imageUrls.map((url, index) => ({
                url,
                position: index,
                isPrimary: index === 0,
              })),
            }
          : undefined,
      },
      include: { images: true, brand: true, model: true, category: true },
    });
  }

  async findAll(query: QueryVehicleDto): Promise<PaginatedResult<unknown>> {
    const where: Prisma.VehicleWhereInput = {
      status: VehicleStatus.PUBLISHED,
      ...(query.brandId && { brandId: query.brandId }),
      ...(query.modelId && { modelId: query.modelId }),
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.country && { country: query.country }),
      ...(query.fuelType && { fuelType: query.fuelType }),
      ...(query.transmission && { transmission: query.transmission }),
      ...(query.condition && { condition: query.condition }),
      ...(query.maxMileage && { mileage: { lte: query.maxMileage } }),
      ...((query.minPrice || query.maxPrice) && {
        price: { gte: query.minPrice ?? 0, lte: query.maxPrice ?? Number.MAX_SAFE_INTEGER },
      }),
      ...((query.minYear || query.maxYear) && {
        year: { gte: query.minYear ?? 1900, lte: query.maxYear ?? new Date().getFullYear() + 1 },
      }),
      ...(query.q && {
        OR: [
          { title: { contains: query.q, mode: 'insensitive' } },
          { description: { contains: query.q, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.vehicle.findMany({
        where,
        skip: query.skip,
        take: query.limit,
        orderBy: { [query.sortBy ?? 'createdAt']: query.order ?? 'desc' },
        include: { images: true, brand: true, model: true, category: true },
      }),
      this.prisma.vehicle.count({ where }),
    ]);

    return {
      data,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { position: 'asc' } },
        brand: true,
        model: true,
        category: true,
        seller: { select: { id: true, firstName: true, lastName: true, avatarUrl: true, country: true } },
        reviews: { include: { author: { select: { firstName: true, lastName: true, avatarUrl: true } } } },
      },
    });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');

    await this.prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { viewsCount: { increment: 1 } },
    });

    return vehicle;
  }

  async update(id: string, sellerId: string, dto: UpdateVehicleDto, isAdmin = false) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');
    if (!isAdmin && vehicle.sellerId !== sellerId) {
      throw new ForbiddenException("Vous ne pouvez modifier que vos propres annonces.");
    }
    await this.assertVinAvailable(dto.vin, id);

    const { imageUrls, ...data } = dto;
    return this.prisma.vehicle.update({ where: { id }, data });
  }

  async remove(id: string, sellerId: string, isAdmin = false) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');
    if (!isAdmin && vehicle.sellerId !== sellerId) {
      throw new ForbiddenException("Vous ne pouvez supprimer que vos propres annonces.");
    }
    return this.prisma.vehicle.update({ where: { id }, data: { status: VehicleStatus.ARCHIVED } });
  }

  findBySeller(sellerId: string) {
    return this.prisma.vehicle.findMany({
      where: { sellerId },
      include: { images: true, brand: true, model: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
