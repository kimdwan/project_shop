import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'src/auth/prisma';
import { ConfigService } from '@nestjs/config';
import { AuthUserService } from 'src/auth/auth.service.user';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/auth/redis';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthUserService,

    PrismaService,
    ConfigService,
    JwtService,
    RedisService,
  ]
})
export class UserModule {}
