import { Injectable } from "@nestjs/common";
import { AuthAuthService } from "src/auth/auth.service.auth";
import { LogOutDto, ProfileDto, UpdateDataDto, UpdateDto, UserIdDto } from "src/dto";

@Injectable()
export class AuthUserAuthServcie {
  constructor (private auth:AuthAuthService){}
  
  async get_profile(dto:UserIdDto) : Promise<ProfileDto> {
    try {
      const profile = await this.auth.get_profile(dto)
      return profile
    }
    catch (err) {
      throw new Error(err)
    }
  } 

  async drop_login(dto:LogOutDto) : Promise<string> {
    try {
      const messages = await this.auth.delete_auth(dto)
      return messages
    }
    catch(err) {
      throw new Error(err)
    }
  }

  make_update(dto:UpdateDto) : UpdateDataDto {
    const updatedatadto = new UpdateDataDto
    updatedatadto.first_name = dto.first_name
    updatedatadto.last_name = dto.last_name
    updatedatadto.age = dto.age
    updatedatadto.gender = dto.gender
    updatedatadto.job = dto.job
    updatedatadto.salary = dto.salary
    updatedatadto.phone = dto.phone
    return updatedatadto
  }

  async update_user(dto:UpdateDataDto) : Promise<object> {
    try {
      const messages = await this.auth.update_user(dto)
      return {messages}
    }
    catch (err) {
      throw new Error(err)
    }
  }
} 