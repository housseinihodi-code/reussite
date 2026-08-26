import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AddImageDto } from './dto/add-image.dto';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertOwnership(vehicleId: string, sellerId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Véhicule introuvable.');
    if (vehicle.sellerId !== sellerId) throw new ForbiddenException();
    return vehicle;
  }

  async add(sellerId: string, dto: AddImageDto) {
    await this.assertOwnership(dto.vehicleId, sellerId);
    const count = await this.prisma.vehicleImage.count({ where: { vehicleId: dto.vehicleId } });
    return this.prisma.vehicleImage.create({
      data: { ...dto, position: count, isPrimary: count === 0 },
    });
  }

  async remove(id: string, sellerId: string) {
    const image = await this.prisma.vehicleImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Image introuvable.');
    await this.assertOwnership(image.vehicleId, sellerId);
    return this.prisma.vehicleImage.delete({ where: { id } });
  }

  async setPrimary(id: string, sellerId: string) {
    const image = await this.prisma.vehicleImage.findUnique({ where: { id } });
    if (!image) throw new NotFoundException('Image introuvable.');
    await this.assertOwnership(image.vehicleId, sellerId);

    await this.prisma.vehicleImage.updateMany({
      where: { vehicleId: image.vehicleId },
      data: { isPrimary: false },
    });
    return this.prisma.vehicleImage.update({ where: { id }, data: { isPrimary: true } });
  }
}
