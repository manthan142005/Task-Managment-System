import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.tasksService.findAll({ projectId, status, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @Req() req: any) {
    return this.tasksService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/comments')
  addComment(@Param('id') id: string, @Body('content') content: string, @Req() req: any) {
    return this.tasksService.addComment(id, req.user.userId, content);
  }

  @Patch(':id/members')
  setMembers(@Param('id') id: string, @Body('memberIds') memberIds: string[]) {
    return this.tasksService.setMembers(id, memberIds);
  }

  @Patch(':id/labels')
  setLabels(@Param('id') id: string, @Body('labels') labels: string[]) {
    return this.tasksService.setLabels(id, labels);
  }
}
