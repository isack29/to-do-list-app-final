import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskRequest } from './dto/TaskRequest';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';

@Controller('/users')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post(':userId/tasks')
  create(
    @Body() taskRequest: TaskRequest,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.tasksService.create(taskRequest, userId, userAuth);
  }

  @Get(':userId/tasks')
  findAllTaskByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() userAuth: AuthenticatedRequest,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    return this.tasksService.findAllTaskByUserId(
      userId,
      userAuth,
      pageNumber,
      size,
    );
  }

  @Get(':userId/tasks/:taskId')
  findOne(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.tasksService.findOne(userId, taskId, userAuth);
  }


  @Patch(':userId/tasks/:taskId')
  update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() taskRequest: TaskRequest,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.tasksService.update(taskId, userId, taskRequest, userAuth);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':userId/tasks/:taskId')
  remove(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() userAuth: AuthenticatedRequest,
  ) {
    return this.tasksService.remove(userId, taskId, userAuth);
  }
}
