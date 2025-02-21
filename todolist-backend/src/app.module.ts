import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthGuard } from './guards/auth.guard';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [UsersModule, PrismaModule, TasksModule],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard }, // 👈 Ahora el guard protege toda la app
  ],
})
export class AppModule {}
