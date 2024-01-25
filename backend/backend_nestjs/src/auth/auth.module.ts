import { Global, Module } from '@nestjs/common';
import { AuthUserService } from './auth.service.user';
import { PrismaService } from './prisma';
import {  ConfigService } from '@nestjs/config';
import { GuardLocalUser } from './guards';
import { StrategyLocalUser } from './strategys';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis';

@Global()
@Module({
  providers : [
    AuthUserService,

    GuardLocalUser,
    StrategyLocalUser,

    PrismaService,
    ConfigService,
    JwtService,
    RedisService,

  ],
  exports : [
    AuthUserService,
  ]
})
export class AuthModule {}
