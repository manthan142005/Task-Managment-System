import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: Partial<{
    fullName: string; title: string; username: string; avatarUrl: string;
  }>) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async updateTheme(id: string, themeMode?: string, colorMode?: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(themeMode ? { themeMode } : {}),
        ...(colorMode ? { colorMode } : {}),
      },
    });
  }

  // Lightweight list used to populate "assign member" pickers.
  async listAll() {
    return this.prisma.user.findMany({
      select: { id: true, fullName: true, username: true, avatarUrl: true },
      take: 50,
    });
  }
}
