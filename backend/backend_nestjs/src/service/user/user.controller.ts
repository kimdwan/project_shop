import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { PayloadDto, SignUpDto } from 'src/dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly main:UserService){}
  
  @UsePipes(new ValidationPipe({
    whitelist : true
  }))
  @Post("signup")
  async signup(@Body() dto:SignUpDto) : Promise<string> {
    const messages = await this.main.signup(dto)
    return messages
  }

  @UseGuards(AuthGuard('local_user'))
  @Post("login")
  async login(@Req() req:Request, @Res({passthrough:true}) res:Response) : Promise<object> {
    const request = req.user
    const payload = this.main.make_payloaddto(request)
    const token_object = await this.main.login(payload)
    const token_list = [
      "computer_number",
      "access_token"
    ]
    token_list.forEach(token => {
      res.cookie(token , token_object[token],{
        httpOnly : true
      })
    })
    return {messages :"로그인 되었습니다."}
  }
}
