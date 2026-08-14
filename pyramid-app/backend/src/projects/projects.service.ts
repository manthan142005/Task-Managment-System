import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany({
      include: { lead: true, _count: { select: { tasks: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  create(data: { title: string; priority?: string; leadId?: string; dueDate?: string }) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        priority: (data.priority as any) || 'NO_PRIORITY',
        leadId: data.leadId,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  }

  update(id: string, data: Partial<{ title: string; priority: string; leadId: string; dueDate: string }>) {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        priority: data.priority as any,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });
  }

  remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
