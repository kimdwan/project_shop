import { Injectable } from '@nestjs/common';
import { AuthUserService } from 'src/auth/auth.service.user';
import { AccessDto, PayloadDto, SignUpDto } from 'src/dto';

@Injectable()
export class UserService {
  constructor(private readonly auth:AuthUserService) {}
  
  async signup(dto:SignUpDto) : Promise<string> {
    try {
      const messages = await this.auth.add_user(dto)
      return messages
    }
    catch(err) {
      throw new Error(err)
    }
  }

  make_payloaddto (data:any) : PayloadDto {
    const payload = new PayloadDto
    payload.userId = data["userId"]
    payload.sub = data["sub"]
    return payload
  }

  async login(payload : PayloadDto) : Promise<AccessDto> {
    try {
      const {computer_number,access_token} = await this.auth.add_jwt(payload)
      return {computer_number,access_token}
    }
    catch (err) {
      throw new Error(err)
    }
  } 

  



}
