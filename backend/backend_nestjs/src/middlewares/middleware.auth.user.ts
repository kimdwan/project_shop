import { Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RedisService } from "src/auth/redis";

@Injectable({scope:Scope.REQUEST})
export class MiddlewareAuthUser implements NestMiddleware {
  private logger = new Logger(MiddlewareAuthUser.name)
  constructor(private redis:RedisService){}

  async use(req: Request, res: Response, next: NextFunction) : Promise<void> {
    this.logger.log("회원님의 페이지로 접근중입니다.")

    const cookies = req.cookies
    const { computer_number,access_token } = {computer_number:cookies["computer_number"], access_token :cookies["access_token"]}
    if (!computer_number || !access_token){
      throw new Error("다시 로그인 해주세요.")
    }
    const refresh_token = await this.redis.get(computer_number)
    if (!refresh_token) {
      throw new Error("다시 로그인 해주세요.")
    }

    const token_datas = {computer_number,refresh_token,access_token}

    Array.from(["computer_number","refresh_token","access_token"]).forEach(names => {
      if (names === "access_token") {
        req.headers["Authorization"] = `Bearer ${token_datas[names]}`
      }
      else {
        req.headers[names] = token_datas[names]
      }
    })
    next()
  }
}