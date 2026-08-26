import { Injectable } from '@nestjs/common';
import { VehicleStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async global(query: SearchQueryDto) {
    const [vehicles, brands, categories] = await Promise.all([
      this.prisma.vehicle.findMany({
        where: {
          status: VehicleStatus.PUBLISHED,
          ...(query.country && { country: query.country }),
          OR: [
            { title: { contains: query.q, mode: 'insensitive' } },
            { description: { contains: query.q, mode: 'insensitive' } },
          ],
        },
        take: 10,
        include: { images: { take: 1 }, brand: true, model: true },
      }),
      this.prisma.brand.findMany({
        where: { name: { contains: query.q, mode: 'insensitive' } },
        take: 5,
      }),
      this.prisma.category.findMany({
        where: { name: { contains: query.q, mode: 'insensitive' } },
        take: 5,
      }),
    ]);

    return { vehicles, brands, categories };
  }
}
