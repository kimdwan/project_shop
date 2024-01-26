import { Module } from '@nestjs/common';
import { AuthUserController } from './auth_user.controller';
import { AuthUserAuthServcie } from './auth_user.service';
import { PrismaService } from 'src/auth/prisma';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/auth/redis';
import { GuardJwtUser } from 'src/auth/guards';

@Module({
  controllers: [AuthUserController],
  providers : [
    AuthUserAuthServcie,
    GuardJwtUser,

    PrismaService,
    ConfigService,
    JwtService,
    RedisService,
    
  ]
})
export class AuthUserModule {}
