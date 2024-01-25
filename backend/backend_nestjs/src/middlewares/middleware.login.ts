import { Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "src/auth/prisma";
import { RedisService } from "src/auth/redis";

@Injectable({ scope:Scope.REQUEST })
export class MiddlewareLogin implements NestMiddleware {
  private logger = new Logger(MiddlewareLogin.name)
  constructor(private prisma:PrismaService, private redis:RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) : Promise<void> {
    this.logger.log("로그인 중입니다.")
    const cookies = req.cookies
    try {
      const computer_number = cookies["computer_number"]
      if (computer_number) {
        const token_list = ["computer_number","access_token"]
        token_list.forEach(token => {
          res.cookie(token,"",{
            httpOnly : true
          })
        }
        )
      await this.prisma.authToken.delete({
        where : {
          computer_number
        }})
      await this.redis.del([computer_number])
      throw new Error("다시 로그인 해주세요.")
      }
      else {
        next()
      }
    } 
    catch(err){
      throw new Error(err)
    }
  }
}