import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModule } from './test/test.module';
import { UserModule, AuthUserModule } from './service';
import { AuthModule } from './auth/auth.module';
import * as CookieParser from "cookie-parser"
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MiddlewareAuthBlacklist, MiddlewareAuthUser, MiddlewareLogin } from './middlewares';
import { PrismaService } from './auth/prisma';
import { RedisService } from './auth/redis';
import { ContactModule } from './service/contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    JwtModule.registerAsync({
      imports : [ConfigModule],
      useFactory : async (config:ConfigService) => ({
        secretOrPrivateKey : config.get("JWT_SECRET"),
        signOptions : {
          expiresIn : config.get("JWT_TIME")
        }
      }),
      inject : [ConfigService]
    }),
    TestModule,
    UserModule,
    AuthModule,
    AuthUserModule,
    ContactModule,
    
  ],
  providers: [
    PrismaService,
    ConfigService,
    JwtService,
    RedisService,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(CookieParser())
    .forRoutes({ path:"*",method:RequestMethod.ALL })
    
    consumer
    .apply(MiddlewareLogin)
    .forRoutes({ path:"/user/login/",method:RequestMethod.POST })

    consumer
    .apply(MiddlewareAuthBlacklist)
    .forRoutes({ path:"/auth/*/",method:RequestMethod.ALL })

    consumer
    .apply(MiddlewareAuthUser)
    .forRoutes({ path:"/auth/*/",method:RequestMethod.ALL })


  }
}
