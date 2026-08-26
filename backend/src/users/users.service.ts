import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({ include: { roles: true } });
    return users.map(this.sanitize);
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id }, include: { roles: true } });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    return this.sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findById(id);
    const user = await this.prisma.user.update({ where: { id }, data: dto });
    return this.sanitize(user);
  }

  async deactivate(id: string) {
    await this.findById(id);
    return this.prisma.user.update({ where: { id }, data: { isActive: false } });
  }

  private sanitize<T extends { passwordHash?: string; refreshTokenHash?: string | null }>(user: T) {
    const { passwordHash, refreshTokenHash, ...rest } = user;
    return rest;
  }
}
