import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthUserService } from "../auth.service.user";
import { LoginDto, PayloadDto } from "src/dto";

@Injectable()
export class StrategyLocalUser extends PassportStrategy(Strategy, 'local_user') {
  constructor (private auth : AuthUserService) {
    super({
      usernameField : "email"
    })
  }

  async validate (email:string , password:string) : Promise<PayloadDto> {
    const logindto = new LoginDto
    logindto.email = email ; logindto.password = password
    const payload = await this.auth.check_user(logindto)
    return payload
  }
}