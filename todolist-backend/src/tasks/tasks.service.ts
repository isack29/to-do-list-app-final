import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskRequest } from './dto/TaskRequest';
import { mapToGlobalSuccessResponse } from 'src/globalDto/globalMapper';
import { AuthenticatedRequest } from 'src/users/dto/AuthenticatedRequest';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    taskRequest: TaskRequest,
    userId: number,
    userAuth: AuthenticatedRequest,
  ) {
    //Validar si usuario existe
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, state: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }

    if (user.id !== userAuth.user.id) {
      throw new UnauthorizedException(
        "user id in url doesn't match with user from bearer token",
      );
    }

    const taskCreated = await this.prismaService.task.create({
      data: {
        title: taskRequest.title,
        description: taskRequest.description,
        date: taskRequest.date,
        state: 'ACTIVE',
        userId: userId,
      },
    });

    const response = mapToGlobalSuccessResponse(
      HttpStatus.CREATED,
      'Task created successfully',
      taskCreated,
    );

    return response;
  }

  async findAllTaskByUserId(
    userId: number,
    userAuth: AuthenticatedRequest,
    page: number,
    pageSize: number,
  ) {
    // Validar usuario
    const userByUrlId = await this.prismaService.user.findUnique({
      where: { id: userId, state: 'ACTIVE' },
    });
  
    if (!userByUrlId) {
      throw new NotFoundException(`User with id ${userId} doesn't exist`);
    }
  
    if (userByUrlId.id !== userAuth.user.id) {
      throw new UnauthorizedException(
        "User id in URL doesn't match with user from bearer token",
      );
    }
  
    // Obtener total de tareas activas
    const totalTasks = await this.prismaService.task.count({
      where: { userId: userId, state: 'ACTIVE' },
    });
  
    const totalPages = Math.ceil(totalTasks / pageSize);
    const skip = (page - 1) * pageSize;
    const take = pageSize;
  
    const tasks = await this.prismaService.task.findMany({
      where: { userId: userId, state: 'ACTIVE' },
      skip: skip,
      take: take,
    });
  
    return {
      statusCode: HttpStatus.OK,
      message: 'User tasks found',
      data: tasks,
      totalTasks, // 🔹 Total de tareas
      totalPages, // 🔹 Total de páginas
      currentPage: page, // 🔹 Página actual
    };
  }

  async findOne(
    userId: number,
    taskId: number,
    userAuth: AuthenticatedRequest,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, state: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }

    //valida que el usuario de la id sea el mismo que el del token
    if (user.id !== userAuth.user.id) {
      throw new UnauthorizedException(
        "user id in url doesn't match with user from bearer token",
      );
    }

    const taskFinded = await this.prismaService.task.findUnique({
      where: { id: taskId, state: 'ACTIVE' },
    });

    if (!taskFinded) {
      throw new NotFoundException("Task doesn't exist");
    }

    if (taskFinded.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    const response = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'task found',
      taskFinded,
    );
    return response;
  }

  async update(
    taskId: number,
    userId: number,
    taskRequest: TaskRequest,
    userAuth: AuthenticatedRequest,
  ) {
    //valida que el usuario de la id exista
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, state: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }

    //valida que el usuario de la id sea el mismo que el del token
    if (user.id !== userAuth.user.id) {
      throw new UnauthorizedException(
        "user id in url doesn't match with user from bearer token",
      );
    }

    //valida si tarea existe
    const taskFinded2 = await this.prismaService.task.findUnique({
      where: { id: taskId, state: 'ACTIVE' },
    });

    if (!taskFinded2) {
      throw new NotFoundException("Task doesn't exist");
    }

    if (taskFinded2.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    const taskUpdate = await this.prismaService.task.update({
      where: { id: taskId },
      data: taskRequest,
    });

    const response = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'task update successfully',
      taskUpdate,
    );

    return response;
  }

  async remove(userId: number, taskId: number, userAuth: AuthenticatedRequest) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId, state: 'ACTIVE' },
    });

    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }

    //valida que el usuario de la id sea el mismo que el del token
    if (user.id !== userAuth.user.id) {
      throw new UnauthorizedException(
        "user id in url doesn't match with user from bearer token",
      );
    }

    const taskFinded = await this.prismaService.task.findUnique({
      where: { id: taskId, state: 'ACTIVE' },
    });

    if (!taskFinded) {
      throw new NotFoundException("Task doesn't exist");
    }

    if (taskFinded.userId !== userAuth.user.id) {
      throw new UnauthorizedException("u can't access to this resource");
    }

    const taskDeleted = await this.prismaService.task.update({
      where: { id: taskId },
      data: { state: 'INACTIVE' },
    });
    console.log(taskDeleted); // taskDeleted

    const response = mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'Task deleted',
    );

    return response;
  }

  async findById(taskId: number) {
    return this.prismaService.task.findUnique({
      where: { id: taskId }, // Buscamos la tarea por su ID
    });
  }
}
