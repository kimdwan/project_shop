import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "./prisma";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "./redis";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { AccessJwtDto, LogOutDto, NewAccessPayloadDto, PayloadDto, ProfileDto, RefreshDto, UpdateDataDto, UserIdDto } from "src/dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthAuthService {
  private logger = new Logger(AuthAuthService.name)
  constructor(private prisma:PrismaService, private config:ConfigService, private redis:RedisService,private jwt:JwtService) {}

  async check_access_token(dto:AccessJwtDto) : Promise<PayloadDto | boolean> {
    try {
      const check_token = await this.jwt.verifyAsync(dto.access_token, {
        secret : this.config.get('JWT_ACCESS_SECRET')
      })
      if (check_token) {
        const payload = new PayloadDto
        payload.userId = check_token["userId"]
        payload.sub = check_token["sub"]
        return payload
      }
    }
    catch(err) {
      if (err instanceof TokenExpiredError) {
        return false
      }
      throw new Error(err)
    }
  }

  async check_refresh_token (dto:RefreshDto) : Promise<NewAccessPayloadDto> {
    this.logger.log("리프레쉬 검증중입니다.")
    try {
      const refresh_check = await this.jwt.verifyAsync(dto.refresh_token, {
        secret : this.config.get("JWT_REFRESH_SECRET")
      })
      const payload = {
        userId : refresh_check["userId"],
        sub : refresh_check["sub"]
      }
      const auth_tokens = await this.prisma.authToken.findUnique({
        where : {
          computer_number : dto.computer_number
        }
      })
      const refresh_hash_check = await bcrypt.compare(dto.refresh_token,auth_tokens.refresh_token_hash)
      if (refresh_hash_check) {
        const new_access_token = await this.jwt.signAsync(payload, {
          secret : this.config.get("JWT_ACCESS_SECRET"),
          expiresIn : this.config.get("JWT_ACCESS_TIME")
        })
        await this.prisma.authToken.update({
          where : {
            computer_number : dto.computer_number
          }, data : {
            access_token : new_access_token
          }
        })
        const new_payload = new NewAccessPayloadDto
        new_payload.access_token = new_access_token
        new_payload.userId = payload.userId
        new_payload.sub = payload.sub
        return new_payload
      }
      else if(!refresh_hash_check) {
        throw new Error("다시 로그인 하셈")
      } 

    }
    catch(err) {
      throw new Error(err)
    }
  }

  async get_profile (dto:UserIdDto) : Promise<ProfileDto> {
    try { 
      const user = await this.prisma.user.findUnique({
        where : {
          id : dto.userId
        }
      })
      if (!user) {
        throw new Error("다시 로그인 해주세요.")
      }
      const profile = new ProfileDto
      profile.email = user.email
      profile.nickname = user.nickname
      profile.first_name = user.first_name
      profile.last_name = user.last_name
      profile.gender = user.gender
      profile.age = user.age
      profile.job = user.job
      profile.salary = user.salary
      profile.phone = user.phone
      return profile
    }
    catch(err) {
      throw new Error(err)
    }
  }

  async delete_auth (dto:LogOutDto) : Promise<string> {
    try {
      await this.prisma.authToken.delete({
        where : {
          computer_number : dto.computer_number
        }
      })
      await this.redis.set(dto.access_token,dto.computer_number)
      await this.redis.expire(dto.access_token,300)
      return "로그아웃 되었습니다."
    }
    catch(err){
      throw new Error(err)
    }
  }

  // 나중에 gender, job을 어떻게 추가할지 알아봐야 함
  async update_user (dto:UpdateDataDto) : Promise<string> {
    try {
      await this.prisma.user.update({
        where : {
          id : dto.id
        }, data : {
          first_name : dto.first_name,
          last_name : dto.last_name,
          age : dto.age,
          salary : dto.salary,
          phone : dto.phone
        }
      });
      return "회원 정보 수정이 완료되었습니다."
    }
    catch (err) {
      throw new Error(err);
    }
  }
}
