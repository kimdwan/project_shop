import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthAuthService } from "../auth.service.auth";
import { AccessDto, AccessJwtDto, PayloadDto, RefreshDto } from "src/dto";

@Injectable()
export class GuardJwtUser implements CanActivate {
  constructor(private auth:AuthAuthService){}

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    try {
      const http = context.switchToHttp()
      const request= http.getRequest()
      const headers = request.headers
      const access_token_list = headers["Authorization"].split(" ")
      if (access_token_list.length < 2) {
        throw new Error("다시 로그인 해주세요.")
      }
      const access_token = access_token_list[1]
      const access_dto = new AccessJwtDto
      access_dto.access_token = access_token
      const payload = await this.auth.check_access_token(access_dto)
      if (payload) {
        request.user = payload
        return true
      }
      else {
        const refresh_dto = new RefreshDto
        refresh_dto.computer_number = headers["computer_number"]
        refresh_dto.refresh_token = headers["refresh_token"]
        const new_payload = await this.auth.check_refresh_token(refresh_dto)
        if (new_payload) {
          const response = http.getResponse()
          response.cookie("access_token",new_payload.access_token,{
            httpOnly : true
          })
          const send_payload = new PayloadDto
          send_payload.userId = new_payload.userId
          send_payload.sub = new_payload.sub
          request.user = send_payload
          return true
        }
      }
    }
    catch(err) {
      throw new UnauthorizedException(err)
    }
  }
}