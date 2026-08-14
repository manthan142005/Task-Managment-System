import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

const includeFull = {
  members: { include: { user: true } },
  labels: true,
  reporter: true,
  subtasks: true,
  project: true,
};

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { projectId?: string; status?: string; search?: string }) {
    return this.prisma.task.findMany({
      where: {
        parentTaskId: null, // top-level tasks only; subtasks are nested
        ...(filters.projectId ? { projectId: filters.projectId } : {}),
        ...(filters.status ? { status: filters.status as any } : {}),
        ...(filters.search
          ? { title: { contains: filters.search } }
          : {}),
      },
      include: includeFull,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        ...includeFull,
        comments: { include: { user: true }, orderBy: { createdAt: 'asc' } },
        activities: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(dto: CreateTaskDto, reporterId: string) {
    const task = await this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: (dto.status as any) || 'TODO',
        priority: (dto.priority as any) || 'NO_PRIORITY',
        projectId: dto.projectId,
        parentTaskId: dto.parentTaskId,
        reporterId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        members: dto.memberIds
          ? { create: dto.memberIds.map((userId) => ({ userId })) }
          : undefined,
        labels: dto.labels ? { create: dto.labels.map((name) => ({ name })) } : undefined,
      },
      include: includeFull,
    });
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, actorId: string) {
    const before = await this.prisma.task.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Task not found');

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.status !== undefined ? { status: dto.status as any } : {}),
        ...(dto.priority !== undefined ? { priority: dto.priority as any } : {}),
        ...(dto.projectId !== undefined ? { projectId: dto.projectId } : {}),
        // Only include date fields when explicitly provided — passing `undefined`
        // to Prisma's update data sets the column to NULL, silently wiping data.
        ...(dto.dueDate !== undefined ? { dueDate: dto.dueDate ? new Date(dto.dueDate) : null } : {}),
        ...(dto.startDate !== undefined ? { startDate: dto.startDate ? new Date(dto.startDate) : null } : {}),
      },
      include: includeFull,
    });

    // Record a simple activity log entry for status/priority changes,
    // mirroring the "You changed priority from X to Y" pattern in the design.
    if (dto.priority && dto.priority !== before.priority) {
      await this.prisma.activity.create({
        data: {
          taskId: id,
          userId: actorId,
          action: 'changed priority',
          fieldName: 'priority',
          oldValue: before.priority,
          newValue: dto.priority,
        },
      });
    }
    if (dto.status && dto.status !== before.status) {
      await this.prisma.activity.create({
        data: {
          taskId: id,
          userId: actorId,
          action: 'changed status',
          fieldName: 'status',
          oldValue: before.status,
          newValue: dto.status,
        },
      });
    }

    return task;
  }

  remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }

  addComment(taskId: string, userId: string, content: string) {
    return this.prisma.comment.create({
      data: { taskId, userId, content },
      include: { user: true },
    });
  }

  async setMembers(taskId: string, memberIds: string[]) {
    await this.prisma.taskMember.deleteMany({ where: { taskId } });
    await Promise.all(
      memberIds.map((userId) =>
        this.prisma.taskMember.create({
          data: { taskId, userId },
        }),
      ),
    );
    return this.findOne(taskId);
  }

  async setLabels(taskId: string, labels: string[]) {
    await this.prisma.taskLabel.deleteMany({ where: { taskId } });
    await Promise.all(
      labels.map((name) =>
        this.prisma.taskLabel.create({
          data: { taskId, name },
        }),
      ),
    );
    return this.findOne(taskId);
  }
}
