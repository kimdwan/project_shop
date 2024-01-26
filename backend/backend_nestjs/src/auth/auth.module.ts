import { Global, Module } from '@nestjs/common';
import { AuthUserService } from './auth.service.user';
import { PrismaService } from './prisma';
import {  ConfigService } from '@nestjs/config';
import { GuardJwtUser, GuardLocalUser } from './guards';
import { StrategyLocalUser } from './strategys';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis';
import { AuthAuthService } from './auth.service.auth';
import { AuthContactService } from './auth.service.contact';

@Global()
@Module({
  providers : [
    AuthUserService,
    AuthAuthService,
    AuthContactService,

    GuardLocalUser,
    StrategyLocalUser,
    GuardJwtUser,

    PrismaService,
    ConfigService,
    JwtService,
    RedisService,

  ],
  exports : [
    AuthUserService,
    AuthAuthService,
    AuthContactService,
    GuardJwtUser,
  ]
})
export class AuthModule {}
