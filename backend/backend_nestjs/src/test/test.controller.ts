import { Body, Controller, Get, Logger, Post, Req, Res } from '@nestjs/common';
import { TestService } from './test.service';
import { Request, Response } from 'express';

@Controller('')
export class TestController {
  private logger = new Logger(TestController.name)
  constructor(private main:TestService) {}

  @Get("")
  test_get(@Req() req:Request , @Res({ passthrough:true }) res:Response):string {
    this.logger.log("test서버 시작합니다.")
    const cookie_lists = ["computer_number","refresh_token","access_token"]
    cookie_lists.forEach(cookie => {
      res.cookie(cookie,"",{
        httpOnly : true
      })
    })
    return this.main.test_get(req.cookies)
  }

  @Post("")
  test_post(@Body() item:any) : string {
    const text = this.main.test_post(item)
    return text
  }
}
