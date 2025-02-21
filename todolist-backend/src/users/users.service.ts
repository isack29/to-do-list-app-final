import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRequest } from './dto/userRequest';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt } from 'src/libs/bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { mapToUserAuthResponseFromUser } from './mapper/user.mapper';
import { mapToGlobalSuccessResponse } from 'src/globalDto/globalMapper';
import { UserLoginRequest } from './dto/UserLoginRequest';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async create(userRequest: UserRequest) {
    //verifica si el usuario existe
    const userFind = await this.prismaService.user.findUnique({
      where: { email: userRequest.email },
    });

    if (userFind) {
      throw new BadRequestException('User already exists');
    }

    //hashea la contraseña
    const passwordHashed = await encrypt(userRequest.password);

    //crea el usuario en la bd
    const userCreated = await this.prismaService.user.create({
      data: {
        name: userRequest.name,
        email: userRequest.email,
        password: passwordHashed,
        state: 'ACTIVE',
      },
    });

    //usa el servicio authService para generar el token
    const access_token = this.authService.generateAccessToken({
      id: userCreated.id,
      email: userCreated.email,
    });

    //mapea a userAuthResponse
    const userAuthResponse = mapToUserAuthResponseFromUser(
      userCreated,
      access_token,
    );

    //mapea a GlobalSuccessResponse(
    return mapToGlobalSuccessResponse(
      HttpStatus.CREATED,
      'User created successfully',
      userAuthResponse,
    );
  }

  async login(userLoginRequest: UserLoginRequest) {
    const user = await this.authService.validateUser(userLoginRequest);

    const token = this.authService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const userAuthResponse = mapToUserAuthResponseFromUser(user, token);

    return mapToGlobalSuccessResponse(
      HttpStatus.OK,
      'User logged in successfully',
      userAuthResponse,
    );
  }

  async findById(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
    });
  }
}
