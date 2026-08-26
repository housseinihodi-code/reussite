import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, vehicleId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_vehicleId: { userId, vehicleId } },
    });
    if (existing) throw new ConflictException('Ce véhicule est déjà dans vos favoris.');

    return this.prisma.favorite.create({ data: { userId, vehicleId } });
  }

  async remove(userId: string, vehicleId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_vehicleId: { userId, vehicleId } },
    });
    if (!existing) throw new NotFoundException('Favori introuvable.');

    return this.prisma.favorite.delete({ where: { userId_vehicleId: { userId, vehicleId } } });
  }

  findAllForUser(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { vehicle: { include: { images: true, brand: true, model: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
