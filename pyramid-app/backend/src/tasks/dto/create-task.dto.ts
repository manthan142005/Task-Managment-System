import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

const STATUSES = ['TODO', 'DOING', 'ON_HOLD', 'COMPLETED'];
const PRIORITIES = ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'];

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: string;

  @IsOptional()
  @IsIn(PRIORITIES)
  priority?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  parentTaskId?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsArray()
  memberIds?: string[];

  @IsOptional()
  @IsArray()
  labels?: string[];
}
