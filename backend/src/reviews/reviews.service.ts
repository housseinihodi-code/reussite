import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, dto: CreateReviewDto) {
    const existing = await this.prisma.review.findUnique({
      where: { vehicleId_authorId: { vehicleId: dto.vehicleId, authorId } },
    });
    if (existing) throw new ConflictException('Vous avez déjà laissé un avis pour ce véhicule.');

    const review = await this.prisma.review.create({
      data: { ...dto, authorId },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
    await this.recomputeVehicleRating(dto.vehicleId);
    return review;
  }

  findByVehicle(vehicleId: string) {
    return this.prisma.review.findMany({
      where: { vehicleId },
      include: { author: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, authorId: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review || review.authorId !== authorId) throw new NotFoundException('Avis introuvable.');

    await this.prisma.review.delete({ where: { id } });
    await this.recomputeVehicleRating(review.vehicleId);
    return { message: 'Avis supprimé.' };
  }

  private async recomputeVehicleRating(vehicleId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { vehicleId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        averageRating: aggregate._avg.rating ?? 0,
        reviewsCount: aggregate._count,
      },
    });
  }
}
