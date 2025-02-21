import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRequest } from './dto/userRequest';
import { UserLoginRequest } from './dto/UserLoginRequest';
import { Public } from '../guards/auth.guard';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.CREATED)
  @Public()
  @Post('sign-up')
  create(@Body() userRequest: UserRequest) {
    return this.usersService.create(userRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('log-in')
  logIn(@Body() userLoginRequest: UserLoginRequest) {
    return this.usersService.login(userLoginRequest);
  }
}
