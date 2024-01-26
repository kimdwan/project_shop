import { Injectable, NestMiddleware, Scope } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "src/auth/redis";


@Injectable({scope:Scope.REQUEST})
export class MiddlewareAuthBlacklist implements NestMiddleware {
  constructor(private redis:RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
      const cookies = req.cookies
      const access_token = cookies["access_token"]
      const check_blacklist = await this.redis.get(access_token)
      if (check_blacklist) {
        throw new Error("다시 로그인 해주세요")
      }
      else {
        next()
      }
    }
    catch(err) {
      throw new Error(err)
    }
  } 
}