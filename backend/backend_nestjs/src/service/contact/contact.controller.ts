import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactDto } from 'src/dto';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly main:ContactService) {}


  @UsePipes(new ValidationPipe({
    whitelist : true
  }))
  @Post("send")
  async send_contact(@Body() dto:ContactDto) : Promise<object> {
    try {
      const messages = await this.main.send_contact(dto)
      return {messages}
    }
    catch (err) {
      throw new Error(err)
    }
  }
}
