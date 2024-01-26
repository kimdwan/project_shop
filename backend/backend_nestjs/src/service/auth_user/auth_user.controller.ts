import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthUserAuthServcie } from './auth_user.service';
import { GuardJwtUser } from 'src/auth/guards';
import { Request, Response } from 'express';
import { LogOutDto, ProfileDto, UpdateDataDto, UpdateDto, UserIdDto } from 'src/dto';

@UseGuards(GuardJwtUser)
@Controller('auth')
export class AuthUserController {
  constructor(private readonly main:AuthUserAuthServcie) {}

  @Get("profile")
  async profile(@Req() req:Request) : Promise<ProfileDto> {
    const request = req.user
    const payload = new UserIdDto
    payload.userId = request["userId"]
    return this.main.get_profile(payload)
  }

  @Get("logout")
  async logout(@Req() req:Request, @Res({passthrough:true}) res:Response) : Promise<object> {
    try {
      const logoutdto = new LogOutDto
      logoutdto.computer_number = req.cookies["computer_number"]
      logoutdto.access_token = req.cookies["access_token"]
      const messages = await this.main.drop_login(logoutdto)
      if (messages) {
        Array.from(["computer_number","access_token"]).forEach(cookie => {
          res.cookie(cookie,"",{
            httpOnly : true
          })
        })
        return {messages}
      }
    }
    catch(err) {
      throw new Error(err)
    }
  }

  @UsePipes(new ValidationPipe ({
    whitelist : true
  }))
  @Post("update")
  async update(@Req() req:Request, @Body() dto:UpdateDto) : Promise<object>{
    try {
      const updatedatadto = this.main.make_update(dto)
      updatedatadto.id = req.user["userId"]
      const messages = await this.main.update_user(updatedatadto)  
      return {messages}
    }
    catch (err) {
      throw new Error(err)
    }
    
  }

}
