import { Injectable } from "@nestjs/common";
import { AccessDto, LoginDto, PayloadDto, SignUpDto } from "src/dto";
import { PrismaService } from "./prisma";
import { ConfigService } from "@nestjs/config";
import * as argon from "argon2"
import * as bcrypt from "bcrypt"
import {v4 as uuid} from "uuid"
import { JwtService } from "@nestjs/jwt";
import { RedisService } from "./redis";

@Injectable()
export class AuthUserService {
  constructor(private prisma:PrismaService, private config:ConfigService, private jwt:JwtService, private redis:RedisService) {}

  async add_user(dto:SignUpDto) : Promise<string> {
    try {
      const check_user = await this.prisma.user.findMany({
        where : {
          OR : [
            { email : dto.email },
            { nickname : dto.nickname }
          ]
        }
      })
      if (check_user.length > 0) {
        throw new Error("이메일 혹은 닉네임이 존재합니다.")
      }
      
      const hash = await argon.hash(dto.password)
      await this.prisma.user.create({
        data : {
          email : dto.email,
          nickname : dto.nickname,
          hash 
        }
      })
      return "회원가입이 완료되었습니다."
    }
    catch (err) {
      throw new Error(err)
    }
  }

  async check_user(dto:LoginDto) : Promise<PayloadDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where : {
          email : dto.email
        }
      })
      if (!user){
        throw new Error("이메일인 존재하지 않습니다.")
      }
      
      const check_password = await argon.verify(user.hash, dto.password)
      if (!check_password) {
        throw new Error('비밀번호가 존재하지 않습니다.')
      }

      const payload = {
        userId : user.id,
        sub : {
          email : user.email,
          nickname : user.nickname
        }
      }
      return payload
    }
    catch (err) {
      throw new Error(err)
    }
  }

  async add_jwt (payloads : PayloadDto) : Promise<AccessDto> {
    try {
      const payload = {
        userId : payloads.userId,
        sub : {
          email : payloads.sub.email,
          nickname : payloads.sub.nickname
        }
      }
      const computer_number = await uuid()

      const refresh_token = await this.jwt.signAsync(payload, {
        secret : this.config.get("JWT_REFRESH_SECRET"),
        expiresIn : this.config.get("JWT_REFRESH_TIME")
      })
      const saltRounds = 10
      const refresh_token_hash = await bcrypt.hash(refresh_token, saltRounds)

      const access_token = await this.jwt.signAsync(payload, {
        secret : this.config.get("JWT_ACCESS_SECRET"),
        expiresIn : this.config.get("JWT_ACCESS_TIME")
      })

      const user = await this.prisma.user.findUnique({
        where : {
          id : payload.userId
        }
      })

      await this.redis.set(computer_number,refresh_token)
      // 7일은 604800초
      await this.redis.expire(computer_number,604800,"XX")

      await this.prisma.authToken.create({
        data : {
          computer_number,
          refresh_token_hash,
          access_token,
          userId : user.id
        }
      })
      
      return { computer_number, access_token }
    }
    catch (err) {
      throw new Error(err)
    }
  }

}